const boards = require('../models/boardsModel')
const mongoose = require('mongoose')
const { sendResponse, getUser, userExists, getUserRights, teamExists, getTeamMembers,
    boardExists, getBoardMembers, addUserInBoard, getCardboardsOfBoard } = require('./auxiliaryFunctions')

const getSearch = (name) => {
    let search = { Name: name }
    if (mongoose.Types.ObjectId.isValid(name))
        search = { _id: name }
    return search
}

const rightsMap = {
    0: "read rights",
    1: "read/write rights",
    2: "admin rights"
}

const checkCardboardAuth = async (res, req, minRights, ...args) => {
    const user = getUser(req)
    let userRights = -1  
    if (!user || !await userExists(user)) {
        sendResponse(res, "User does not exists!")
        return false
    } 

    const members = await getBoardMembers(req.params.id)
    for (member of members) { 
        if (member.Name === user) {
            userRights = member.Rights
            break
        }
    }

    if (userRights < minRights) {
        sendResponse(res, `You don't have necesary rights (${rightsMap[minRights]})!`)
        return false
    }
 
    return true
}

const controller = {
    //POST /api/boards
    create: async (req, res) => {
        try {
            const user = getUser(req)

            if (!user || !await userExists(user))
                throw "User Missing"

            if (!req.body.Name)
                throw "Missing Name!"

            if (await boardExists(req.body.Name))
                throw "Board already exists!"

            let newBoard = {
                "Name": req.body.Name,
                "Team": null,
                "Members": [{ Name: user, Rights: 2 }],
                "BackgroundImage": "white.png",
            }

            //Add team + members of it
            if (req.body.Team) {
                if (!await teamExists(req.body.Team))
                    throw "Team does not exist!"

                const members = await getTeamMembers(req.body.Team)

                //Check if you are the leader
                if (members[0] !== user)
                    throw "Only the leader can add a team"

                newBoard["Team"] = req.body.Team
                newBoard["Members"] = members.map(member => {
                    return { Name: member, Rights: member === user ? 2 : 1 }
                })
            }

            if (req.body.BackgroundImage) {
                if (!backgroundImage.match(/\.(jpeg|jpg|gif|png)$/))
                    throw "Image does not exists!"
                newBoard["BackgroundImage"] = req.body.BackgroundImage
            }

            boards.create(newBoard, (err, data) => sendResponse(res, err, data))
        }
        catch (err) {
            sendResponse(res, err)
        }
    },

    //GET /api/boards?Name=..&User=...
    find: (req, res) => {
        try {
            let board = {}
            if (!req.query.Name && !req.query.User)
                throw "Invalid searching criteria"

            if (req.query.Name)
                board["Name"] = new RegExp(req.query.Name, 'i')

            if (req.query.User)
                board["Members.Name"] = req.query.User

            boards.find(board, (err, data) => {
                if (err || !data[0])
                    sendResponse(res, err)
                else
                    sendResponse(res, err, data.map(d => ( {Name: d.Name, Team: d.Team, BackgroundImage: d.BackgroundImage})) )
            })
        }
        catch (err) {
            sendResponse(res, err)
        }
    },

    //GET /api/boards/:id
    read: (req, res) => {
        boards.find(getSearch(req.params.id), (err, data) => {
            if (err || !data[0])
                sendResponse(res, err)
            else
                sendResponse(res, err, data.map(d => {
                    return {
                        Name: d.Name,
                        Team: d.Team,
                        Members: d.Members.map(m => m.Name),
                        BackgroundImage: d.BackgroundImage
                    }
                }))
        })
    },

    //GET /api/boards/:id/team
    readTeam: (req, res) => {
        try {
            boards.find(getSearch(req.params.id), (err, data) => {
                if (err || !data[0])
                    sendResponse(res, err)
                else
                    sendResponse(res, err, data[0].Team)
            })
        }
        catch (err) {
            sendResponse(res, err)
        }
    },

    //GET /api/boards/:id/users
    readUsers: async (req, res) => {
        try {
            const members = await getBoardMembers(req.params.id)
            sendResponse(res, undefined, members)
        }
        catch (err) {
            sendResponse(res, err)
        }
    },

    //GET /api/boards/:id/user/:user
    readUser: async (req, res) => {
        try {
            const members = await getBoardMembers(req.params.id)
            for (let member of members)
                if (member.Name === req.params.user) {
                    sendResponse(res, null, member)
                    return
                }
            sendResponse(res, "User not found!")
        }
        catch (err) {
            sendResponse(res, err)
        }
    },

    //POST /api/boards/:id/users
    addMembers: async (req, res) => {
        try {
            const user = getUser(req)
            let userRights = -1;
            let newMembers = req.body.Users
            const teamName = req.params.id

            if (!user || !await userExists(user))
                throw "User does not exists!"

            if (!teamName || !await teamExists(teamName))
                throw "Team does not exist!"

            if (!newMembers || !newMembers[0] || !newMembers[0].Name || !newMembers[0].Rights)
                throw `Users array is missing! Request example: Users: [{Name: "John", Rights: "1"}])`

            const members = await getBoardMembers(req.params.id)
            for (let member of members) {
                if (member.Name === user)
                    userRights = member.Rights

                //Remove duplicate members
                newMembers = newMembers.filter(newM => newM.Name !== member.Name)
            }

            if (userRights < 2)
                throw "You don't have rights to add user!"

            for (member of newMembers) {

                if (!await userExists(member.Name))
                    throw `User ${member.Name} does not exist!`

                if (member.Rights < 0 || member.Rights > 2)
                    throw `Invalid right ${member.Rights}`

                if (await addUserInBoard(teamName, member.Name, member.Rights) === false)
                    throw "Error adding users"
            }
            sendResponse(res, undefined, "users added!")
        }
        catch (err) {
            sendResponse(res, err)
        }
    },

    //PATCH /api/boards/:id/users/:user
    changeUser: async (req, res) => {
        try {
            const adminUser = getUser(req)
            let admninUserRights = -1
            const modifiedUser = req.params.user
            const modifiedUserRights = req.body.Rights
            const teamName = req.params.id

            if (!adminUser || !await userExists(adminUser))
                throw "User does not exists!"

            if (!teamName || !await teamExists(teamName))
                throw "Team does not exist!"

            if (!modifiedUserRights || modifiedUserRights < 0 || modifiedUserRights > 2)
                throw "Invalid user rights!"

            const members = await getBoardMembers(req.params.id)
            let newMembers = []
            let userInBoard = false
            for (let member of members) {
                if (member.Name === adminUser) {
                    admninUserRights = member.Rights
                }
                if (member.Name === modifiedUser) {
                    userInBoard = true
                    newMembers.push({ Name: modifiedUser, Rights: modifiedUserRights })
                }
                else {
                    newMembers.push(member)
                }
            }

            if (admninUserRights < 2)
                throw "User does not have authorization to change role!"

            if (userInBoard === false)
                throw "User is not in this board!"

            boards.findOneAndUpdate(
                getSearch(req.params.id),
                { Members: newMembers },
                (err, data) => sendResponse(res, err, "modified!")
            )
        }
        catch (err) {
            sendResponse(res, err)
        }
    },

    //DELETE /api/boards/:id/users/:user
    deleteUser: async (req, res) => {
        try {
            const adminUser = getUser(req)
            let admninUserRights = -1
            const teamName = req.params.id
            const removedUser = req.params.user

            if (!adminUser || !await userExists(adminUser))
                throw "User Missing"

            if (!teamName || !await teamExists(teamName))
                throw "Team does not exist!"

            const members = await getBoardMembers(req.params.id)
            let newMembers = []
            for (let member of members) {
                if (member.Name === adminUser) {
                    admninUserRights = member.Rights
                }
                if (member.Name === removedUser) {
                    if (member.Rights === 2)
                        throw "Cannot remove admin user!"
                }
                else {
                    newMembers.push(member)
                }
            }

            if (admninUserRights < 2)
                throw "User does not have authorization to remove another user!"

            boards.findOneAndUpdate(
                getSearch(teamName),
                { Members: newMembers },
                (err, data) => sendResponse(res, err, "removed!")
            )
        }
        catch (err) {
            sendResponse(res, err)
        }
    },

    //GET /api/boards/:id/backgroundImage
    readBackgroundImg: async (req, res) => {
        try {
            boards.find(getSearch(req.params.id), (err, data) => {
                if (err || !data[0])
                    sendResponse(res, err)
                else
                    sendResponse(res, err, data[0].BackgroundImage)
            })
        }
        catch (err) {
            sendResponse(res, err)
        }
    },

    //PATCH /api/boards/:id/backgroundImage
    changeBackgroundImg: async (req, res) => {
        try {
            const adminUser = getUser(req)
            const backgroundImage = req.body.BackgroundImage
            const teamName = req.params.id

            if (!adminUser || !await userExists(adminUser))
                throw "User does not exists123!"

            if (!teamName || !await teamExists(teamName))
                throw "Team does not exist!"

            if (!backgroundImage || !backgroundImage.match(/\.(jpeg|jpg|gif|png)$/))
                throw "Image does not exists!"

            const newImage = { BackgroundImage: backgroundImage }
            boards.findOneAndUpdate(
                getSearch(teamName),
                newImage,
                (err, data) => sendResponse(res, err, newImage)
            )
        }
        catch (err) {
            sendResponse(res, err)
        }
    },

    //GET /api/boards/:id/cardboards
    readCardboards: async (req, res) => {
        if (await checkCardboardAuth(res, req, 0) === true) {
            boards.find(getSearch(req.params.id), (err, data) => {
                if (err)
                    sendResponse(res, err)
                else if(!data[0])
                    res.json({ success: true, data: []})
                else
                    res.json({ success: true, data: data.map( d => d.Cardboards)}) 
            })
        }
    },

    //POST /api/boards/:id/cardboards
    createCardboard: async (req, res) => {

        if (!req.body.Name)
            sendResponse(res, "Plese provide a name for the cardboard!")

        else if (await checkCardboardAuth(res, req, 1) === true) { 
            const newCardboard = {
                Name: req.body.Name,
                Cards: []
            }
            const cardboards = await getCardboardsOfBoard(req.params.id)

            for (cardboard of cardboards) {
                if (cardboard.Name === newCardboard.Name) {
                    sendResponse(res, "Cardboard with that name already exists!")
                    return
                }
            } 

            boards.findOneAndUpdate(
                getSearch(req.params.id),
                { Cardboards: [...cardboards, newCardboard] },
                (err, data) => sendResponse(res, err, data)
            ) 
        }
    },

    //PATCH /api/boards/:id/cardboards 
    swapCardboards: async (req, res) => {

        if (!req.body.Name1 || !req.body.Name2)
            sendResponse(res, "Plese provide the name of the cardboards!")

        else if (await checkCardboardAuth(res, req, 1) === true) {
            const cardboards = await getCardboardsOfBoard(req.params.id)

            let cardboard1 = null, cardboard2 = null
            for (cardboard of cardboards) {
                if (cardboard.Name === req.body.Name1) {
                    cardboard1 = cardboard
                }
                else if (cardboard.Name === req.body.Name2) {
                    cardboard2 = cardboard
                }
            }

            if (!cardboard1) {
                sendResponse(res, "First name does not exist in cardboards")
            }
            else if (!cardboard2) {
                sendResponse(res, "Second name does not exist in cardboards")
            }
            else {
                const newCardboards = cardboards.map(cardboard => {
                    if (cardboard.Name === req.body.Name1)
                        return cardboard2

                    if (cardboard.Name === req.body.Name2)
                        return cardboard1

                    return cardboard
                })

                boards.findOneAndUpdate(
                    getSearch(req.params.id),
                    { Cardboards: [...newCardboards] },
                    (err, data) => sendResponse(res, err, data)
                )
            }
        }
    },

    //GET /api/boards/:id/cardboards/:name
    readCardboard: async (req, res) => {
        if (await checkCardboardAuth(res, req, 0) === true) {

            const cardboards = await getCardboardsOfBoard(req.params.id)

            for (cardboard of cardboards) {
                if (cardboard.Name === req.params.name) {
                    sendResponse(res, null, cardboard)
                    return
                }
            }

            sendResponse(res, "cardboard not found!")
        }
    },

    //PATCH /api/boards/:id/cardboards/:name
    changeName: async (req, res) => {

        if (!req.body.Name)
            sendResponse(res, "Plese provide a new name for the cardboard!")
        
        else if (await checkCardboardAuth(res, req, 1) === true) {

            const oldName = req.params.name
            const newName = req.body.Name  
            
            let cardboards = await getCardboardsOfBoard(req.params.id)
            for (cardboard of cardboards) {
                if (cardboard.Name === oldName) {
                    cardboard.Name = newName
                }
                else if (cardboard.Name === newName) {
                    sendResponse(res, "Name already exists!")
                    return
                }
            }

            boards.findOneAndUpdate(
                getSearch(req.params.id),
                { Cardboards: cardboards },
                (err, data) => sendResponse(res, err, data)
            )
        }
    },

    //DETELE /api/boards/:id/cardboards/:name
    deleteCardboard: async (req, res) => {
        if (await checkCardboardAuth(res, req, 1) === true) {

            let cardboards = await getCardboardsOfBoard(req.params.id)
            cardboards = cardboards.filter(cardboard => cardboard.Name !== req.params.name)
            boards.findOneAndUpdate(
                getSearch(req.params.id),
                { Cardboards: cardboards },
                (err, data) => sendResponse(res, err, data)
            )
        }
    },

    //GET /api/boards/:id/cardboards/:name/cards
    readCards: async (req, res) => {
        if (await checkCardboardAuth(res, req, 0) === true) { 
            let cardboards = await getCardboardsOfBoard(req.params.id) 
            cardboards = cardboards.filter(cardboard => cardboard.Name === req.params.name)

            if (cardboards)
                sendResponse(res, null, cardboards[0].Cards) 
            else
                sendResponse(res, "Cardboard not found!")
        }
    },

    //POST /api/boards/:id/cardboards/:name/cards
    createCard: async (req, res) => {
        if (!req.body.Name)
            sendResponse(res, "Card name is required!")

        else if (await checkCardboardAuth(res, req, 1) === true) {
            
            let cardboards = await getCardboardsOfBoard(req.params.id)

            for (cardboard of cardboards) { 
                if (cardboard.Name === req.params.name) { 
                    const cards = cardboard.Cards
                    const newCard = { Name: req.body.Name}
                    
                    if (cards.find(card => card.Name === req.body.Name)) {
                        sendResponse(res, "Card with that name already exists!")
                        return
                    }
                    
                    if (req.body.Description) {
                        newCard["Description"] = req.body.Description
                    } 
                    if (req.body.Labels) {
                        newCard["Labels"] = [ ...req.body.Labels ]
                    }

                    cardboard.Cards = [...cards, newCard] 
                }
            }

            boards.findOneAndUpdate(
                getSearch(req.params.id),
                { Cardboards: cardboards },
                (err, data) => sendResponse(res, err, data)
            )
        }
    },

    //PATCH /api/boards/:id/cardboards/:name/cards
    swapCards: async (req, res) => {

        if (!req.body.Name1 || !req.body.Name2)
            sendResponse(res, "Plese provide the name of the cardboards!")

        else if (await checkCardboardAuth(res, req, 1) === true) {

            let cardboards = await getCardboardsOfBoard(req.params.id) 
            for (cardboard of cardboards) { 
                if (cardboard.Name === req.params.name) { 
                    const cards = cardboard.Cards
                    const card1 = cards.find(card => card.Name === req.body.Name1)
                    const card2 = cards.find(card => card.Name === req.body.Name2)

                    if (!card1 || !card2) {
                        sendResponse(res, "One of the cards not Found!")
                        return
                    }

                    //Swap
                    const newCards = cards.map( card => {
                        if (card.Name === req.body.Name1)
                            return card2
                        if (card.Name === req.body.Name2)
                            return card1
                        return card
                    })

                    cardboard.Cards = newCards
                }
            }

            boards.findOneAndUpdate(
                getSearch(req.params.id),
                { Cardboards: cardboards },
                (err, data) => sendResponse(res, err, data)
            )
        }
    },

    //PATCH /api/boards/:id/cardboards/:name/cards/:name2
    modifyCard: async (req, res) => {
        if (await checkCardboardAuth(res, req, 1) === true) {

            let cardboards = await getCardboardsOfBoard(req.params.id) 
            for (cardboard of cardboards) { 
                //Find cardboard by name
                if (cardboard.Name === req.params.name) {  

                    //Find card and change it
                    cardboard.Cards.forEach( card => {
                        if (card.Name === req.params.name2){ 
                            card.Name = req.body.Name || card.Name
                            card.Description = req.body.Description || card.Description
                            card.Labels = req.body.Labels || card.Labels
                        }
                    })
                }
            }

            boards.findOneAndUpdate(
                getSearch(req.params.id),
                { Cardboards: cardboards },
                (err, data) => sendResponse(res, err, data)
            )
        }
    },    


    //DELETE /api/boards/:id/cardboards/:name/cards/:name2
    deleteCard: async (req, res) => {
        if (await checkCardboardAuth(res, req, 1) === true) { 

            let cardboards = await getCardboardsOfBoard(req.params.id) 
            for (cardboard of cardboards) { 
                if (cardboard.Name === req.params.name) {  
                    cardboard.Cards = cardboard.Cards.filter(card => card.Name !== req.params.name2)
                }
            }

            boards.findOneAndUpdate(
                getSearch(req.params.id),
                { Cardboards: cardboards },
                (err, data) => sendResponse(res, err, data)
            )
        }
    },

    //DELETE /api/boards/:id
    deleteBoard: async (req, res) => {  
        if (await checkCardboardAuth(res, req, 2) === true) { 
            boards.deleteOne(
                getSearch(req.params.id), 
                (err, { deletedCount }) => sendResponse(res, err, { deletedCount: deletedCount } )
            )
        }
    }
}
module.exports = controller