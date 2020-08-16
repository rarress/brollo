const boards = require('../models/boardsModel')
const mongoose = require('mongoose')
const teamsController = require('./teamsController')
const { sendResponse, getUser, userExists, getUserRights, teamExists, getTeamMembers, 
        boardExists, getBoardMembers, addUserInBoard } = require('./auxiliaryFunctions')

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
                "BackgroundImage": req.body.BackgroundImage || "white.png",
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
        let search = { Name: req.params.id}
        if (mongoose.Types.ObjectId.isValid(req.params.id))
            search = { _id: req.params.id}

        boards.find(search, (err, data) => {
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
            let search = { Name: req.params.id}
            if (mongoose.Types.ObjectId.isValid(req.params.id))
                search = { _id: req.params.id}
            boards.find(search, (err, data) => {
                if (err || !data[0])
                    sendResponse(res, err)
                else
                    sendResponse(res, err, data.map(d => d.Team))
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
            sendResponse(res, undefined, {Members: members})
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
            let admninUserRights = -1;
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
            
            let search = { Name: teamName }
            if (mongoose.Types.ObjectId.isValid(teamName))
                search = { _id: teamName } 
            console.log(search, newMembers)
            boards.findOneAndUpdate(
                search,
                {Members: newMembers},
                (err, data) => sendResponse(res, err, "modified!")
            )
        }
        catch (err) {
            sendResponse(res, err)
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