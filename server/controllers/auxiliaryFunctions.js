const mongoose = require('mongoose')
const users = require('../models/userModel')
const boards = require('../models/boardsModel')
const teams = require('../models/teamsModel')
let secret = process.env.JWT_SECRET || require('../secrets/jwt-token')
const jwt = require('jsonwebtoken')

const functions = {
    sendResponse: (res, err, data) => {
        if (err) {
            console.log(err)
            res.json({ success: false, message: err })
        }
        else if (!data || data.length == 0)
            res.json({ success: false, message: "Not Found" })
        else
            res.json({ success: true, data: data })
    },

    getUser: (req) => {
        const token = req.cookies.access_token || req.body.access_token

        let user
        try {
            user = jwt.verify(token, secret).Username
        }
        catch {
            user = null
        }
        return user
    },

    isFieldUnique: (object) => new Promise(
        (resolve) => users.findOne(object).exec((err, data) => data ? resolve(true) : resolve(false))
    ),

    userExists: (user) => new Promise(resolve =>
        users.find({ Username: user }, (err, data) => !data || data.length === 0 ? resolve(false) : resolve(true))
    ),

    getUserRights: async (boardId, user) => {
        const { Members } = await boards.findOne({ _id: boardId }).select('Members')
        for (let member of Members)
            if (member.Name === user)
                return member.Rights
        return null
    },

    teamExists: (name) => new Promise(resolve => { 
        let search = { Name: name }
        if (mongoose.Types.ObjectId.isValid(name))
            search = { _id: name }
        teams.find(search, (err, data) => !data || data.length === 0 ? resolve(false) : resolve(true))
    }),

    getTeamMembers: (name) => new Promise(resolve => { 
        let search = { Name: name }
        if (mongoose.Types.ObjectId.isValid(name))
            search = { _id: name }
        teams.find(search, (err, data) => !data || data.length === 0 ? resolve([]) : resolve(data[0].Members))
    }),

    getTeamBoards: (name) => new Promise(resolve => {
        teams.find({ Name: name }, (err, data) => !data || data.length === 0 ? resolve([]) : resolve(data[0].Boards))
    }),

    boardExists: (name) => new Promise(resolve =>
        boards.find({ Name: name }, (err, data) => !data || data.length === 0 ? resolve(false) : resolve(true))
    ),

    getBoardMembers: (name) => new Promise(resolve => {
        boards.find({ Name: name}, (err, data) => !data || data.length === 0 ? resolve([]) : resolve(data[0].Members))
    }),

    addUserInBoard: (name, user, userRights) => new Promise( async resolve => {

        let search = { Name: name }
        if (mongoose.Types.ObjectId.isValid(name))
            search = { _id: name }

        let members = await new Promise(resolve => {
            boards.find({ Name: name}, (err, data) => !data || data.length === 0 ? resolve([]) : resolve(data[0].Members))
        })
        
        const userIsInTeam = members.some(member => member.Name === user)  
        if (userIsInTeam === false) {
            members = [...members, {Name: user, Rights: userRights}]
            boards.findOneAndUpdate(
                search, 
                {'Members': members},
                (err, data) => err || !data || data.length === 0 ? resolve(false) : resolve(true)
            )  
        }
        else 
            resolve(false)
    }),

    removeUsersFromBoard: (name, user) => new Promise( async resolve => {
        let members = await new Promise(resolve => {
            boards.find({ Name: name}, (err, data) => !data || data.length === 0 ? resolve([]) : resolve(data[0].Members))
        })
        
        members = members.filter(member => member.Name !== user)

        boards.findOneAndUpdate(
            {Name: name}, 
            {'Members': members},
            (err, data) => err || !data || data.length === 0 ? resolve(false) : resolve(true)
        )   
    }),
}

module.exports = functions