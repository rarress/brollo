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

const checkCardboardAuth = async (res, req, minRights) => {
    const user = getUser(req)
    let userRights = -1
    const teamName = req.params.id
 
    if (!user || !await userExists(user)) {
        sendResponse(res, "User does not exists!")
        return false
    }
    
    if (!teamName || !await teamExists(teamName)) {
        sendResponse(res, "Team does not exist!")
        return false
    }
        
    const members = await getBoardMembers(teamName)  
    for (member of members) {
        console.log(member)
        if (member.Name === user) {
            userRights = member.Rights
            break
        }
    }
 
    if (userRights < minRights) {
        sendResponse(res, "You cannot see this board!")
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

            boards.find( board, (err, data) => {
                if (err || !data[0])
                    sendResponse(res, err)
                else
                    sendResponse(res, err, data.map(d => d.Name))
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

            if(!newMembers || !newMembers[0] || !newMembers[0].Name || !newMembers[0].Rights)
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
            for (let member of members){
                if (member.Name === adminUser) {
                    admninUserRights = member.Rights
                }
                if (member.Name === modifiedUser) {
                    userInBoard = true
                    newMembers.push({Name: modifiedUser, Rights: modifiedUserRights})
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
                {Members: newMembers},
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
                {Members: newMembers},
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
             
            const newImage = {BackgroundImage: backgroundImage}
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
                if (err || !data[0])
                    sendResponse(res, err)
                else
                    sendResponse(res, err, data[0].Cardboards)
            })
        } 
    },

    //POST /api/boards/:id/cardboards
    createCardboard: async (req, res) => {
        if (!req.body.Name) 
            sendResponse(res, "Plese provide a name for the cardboard!")
        else if (await checkCardboardAuth(res, req, 1) === true) {    
            let canAddCardboard = true

            const newCardboard = {
                Name: req.body.Name,
                Cards: []
            }
            const cardboards = await getCardboardsOfBoard(req.params.id)

            for (cardboard of cardboards) {
                if (cardboard.Name === newCardboard.Name) {
                    sendResponse(res, "Cardboard with that name already exists!")
                    canAddCardboard = false
                }
            }

            if (canAddCardboard === true) {
                boards.findOneAndUpdate(
                    getSearch(req.params.id), 
                    {Cardboards: [...cardboards, newCardboard]},
                    (err, data) => sendResponse(res, err, data)
                )   
            }
        }
    },

    //DELETE /api/boards/:id
    delete: async (req, res) => {
        try {
            const user = getUser(req)

            if (!user || !await userExists(user))
                throw "User Missing"

            if (await getUserRights(req.params.id, user) !== 2)
                throw "User does not have authorization!"

            boards.deleteOne({ _id: req.params.id }, (err, { deletedCount }) => sendResponse(res, err, { deletedCount: deletedCount }))
        }
        catch (err) {
            sendResponse(res, err)
        }
    }
}
module.exports = controller