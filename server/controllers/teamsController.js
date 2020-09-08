const teams = require('../models/teamsModel') 
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const secret = process.env.JWT_SECRET || require('../secrets/jwt-token')
const boardsController = require('./boardsController')
const {sendResponse, getUser, userExists, teamExists, getTeamMembers, 
        getTeamBoards, addUserInBoard, removeUsersFromBoard} = require('./auxiliaryFunctions')

const controller = {
    //POST /api/teams
    create: async (req, res) => {
        try { 
            const user = getUser(req)

            if (!user || !await userExists(user))
                throw "User does not exists!"
 
            if (!req.body.Name || await teamExists(req.body.Name)) 
                throw "No name provided/ is already taken!"

            const newTeam = { Name: req.body.Name, Members: [user] }
            teams.create(newTeam, (err, data) => sendResponse(res, err, data))
        }
        catch (err) {
            sendResponse(res, err)
        }
    },

    //GET /api/teams/:id
    read: (req, res) => {
        let search = {Name: req.params.id} 
        if(mongoose.Types.ObjectId.isValid(req.params.id))
            search = {_id: req.params.id} 
        teams.findOne(search, (err, data) => sendResponse(res, err, data))
    },

    //GET /api/teams?Name=...&User=..
    find: (req, res) => {
        try {
            let team = {}
            if (!req.query.Name && !req.query.User)
                throw "Invalid searching criteria"

            if (req.query.Name)
                team["Name"] = new RegExp(req.query.Name, 'i')

            if (req.query.User)
                team["Members"] = req.query.User

            teams.find(team, (err, data) => sendResponse(res, err, data))
        }
        catch (err) {
            sendResponse(res, err)
        }
    },

    //PUT /api/teams/:id
    addUser: async (req, res) => {
        try {
            let teamUpdate = {}
            const teamName = req.params.id 
            const newUser = req.body.User
            const adminUser = getUser(req)
            
            if (!adminUser || !await userExists(adminUser))
                throw "User does not exists!"

            if (!teamName || !await teamExists(teamName))
                throw "Team does not exist!"

            const members = await getTeamMembers(teamName)
            if (members[0] !== adminUser)
                throw "You are not the team leader!"

            if (!newUser || !await userExists(newUser))
                throw "User you want to add does not exists!"
            
            if (members.includes(newUser))
                throw "User already in team!"
            
            teamUpdate["Members"] = [...members, newUser]

            let search = { Name: teamName}
            if (mongoose.Types.ObjectId.isValid(teamName))
                search = { _id: teamName}

            teams.findOneAndUpdate(
                search,
                teamUpdate,
                async (err, data) => {
                    //Also add the user to all team boards once he is added to the team
                    if (!err) {
                        const boards = await getTeamBoards(teamName) 
                        for (board of boards)
                            addUserInBoard(board, newUser, 1)
                    }
                    sendResponse(res, err, data)
                }
            )
        }
        catch (err) {
            sendResponse(res, err)
        }
    },

    //DELETE /api/teams/:id/user/:user
    deleteUser: async (req, res) => {
        try {
            let teamUpdate = {}
            const adminUser = getUser(req)
            const removedUser = req.params.user
            const teamName = req.params.id

            if (!adminUser || !await userExists(adminUser))
                throw "User does not exists!"

            if (!teamName || !await teamExists(teamName))
                throw "Team does not exist!"

            const members = await getTeamMembers(teamName)
            if (members[0] !== adminUser)
                throw "You are not the team leader!"

            if (!removedUser || !await userExists(removedUser))
                throw "User you want to delete does not exists!"

            if (!members.includes(removedUser))
                throw "User not in team!"
 
            teamUpdate["Members"] = members.filter(member => member !== removedUser) 

            let search = { Name: teamName}
            if (mongoose.Types.ObjectId.isValid(teamName))
                search = { _id: teamName}

            teams.findOneAndUpdate(
                search,
                teamUpdate,
                async (err, data) => {
                    //Also remove the user from all team boards once he is removed from the team
                    if (!err) {
                        const boards = await getTeamBoards(teamName) 
                        for (board of boards)
                            removeUsersFromBoard(board, removedUser)
                    }
                    sendResponse(res, err, data)
                }
            )
        }
        catch (err) {
            sendResponse(res, err)
        }
    },

    //GET /api/teams/:id/leader
    readLeader: async (req, res) => {
        const members = await getTeamMembers(req.params.id)
        sendResponse(res, undefined, {Name: members[0]})
    },

    //PATCH /api/teams/:id/leader
    changeTeamLeader: async (req, res) => {
        try {
            let teamUpdate = {}
            const adminUser = getUser(req)
            const newLeader = req.body.User
            const teamName = req.params.id

            if (!adminUser || !await userExists(adminUser))
                throw "User does not exists!"

            if (!teamName || !await teamExists(teamName))
                throw "Team does not exist!"

            const members = await getTeamMembers(teamName)
            if (members[0] !== adminUser)
                throw "You are not the team leader!"

            if (!newLeader || !await userExists(newLeader))
                throw "User you want to promote does not exists!"

            if (!members.includes(newLeader))
                throw "User not in team!"
 
            const otherMembers = members.filter(member => member !== newLeader) 
            teamUpdate["Members"] = [newLeader, ...otherMembers]

            let search = { Name: teamName}
            if (mongoose.Types.ObjectId.isValid(teamName))
                search = { _id: teamName}

            teams.findOneAndUpdate(
                search,
                teamUpdate,
                async (err, data) => { 
                    sendResponse(res, err, data)
                }
            )
        }
        catch (err) {
            sendResponse(res, err)
        }
    },

    //DELETE /api/teams/:id
    delete: async (req, res) => {
        try {
            const user = getUser(req)
            const teamName = req.params.id

            if (!user || !await userExists(user))
                throw "User does not exists!"

            if (!teamName || !await teamExists(teamName)) 
                throw "No name provided!"

            const members = await getTeamMembers(teamName) 
            if (members[0] !== user)
                throw "You are not the team leader!"

            let search = { Name: teamName}
            if (mongoose.Types.ObjectId.isValid(teamName))
                search = { _id: teamName}

            teams.deleteOne(search, (err, { deletedCount }) => sendResponse(res, err, { deletedCount: deletedCount }))
        }
        catch (err) {
            sendResponse(res, err)
        }
    }
}
module.exports = controller