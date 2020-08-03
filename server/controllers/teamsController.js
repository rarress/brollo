const teams = require('../models/teamsModel') 
const users = require('../models/userModel') 
const boards = require('../models/boards')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken');
let secret = process.env.JWT_SECRET || require('../secrets/jwt-token')

const sendResponse = (res, err, data) => {
    if (err)
        res.json({ success: false, message: err })
    else if (!data || data.length == 0)
        res.json({ success: false, message: "Not Found" })
    else 
        res.json({ success: true, data: data })
}  

const userExists = (user) => new Promise( resolve => {
    if (!user) 
        resolve(false)
    else 
        users.find({Username: user}, (err, data) => !data || data.length === 0 ? resolve(false) : resolve(true) )
})

const boardExists = (id) => new Promise( resolve => {
    if (!user) 
        resolve(false)
    else 
        boards.find({_id: id}, (err, data) => !data || data.length === 0 ? resolve(false) : resolve(true) )
})

const getMembers = (teamId) => new Promise( resolve => {
    teams.find({_id: teamId}, (err, data) => !data || data.length === 0 ? resolve(null) : resolve(data[0].Members) )
})

const getBoards = (teamId) => new Promise( resolve => {
    teams.find({_id: teamId}, (err, data) => !data || data.length === 0 ? resolve(null) : resolve(data[0].Boards) )
})

//TODO TEAM EXISTS

const controller = {
    create: async (req, res) => {
        try {   
            const token = req.body.access_token || req.cookies.access_token
            const user = jwt.verify(token, secret).Username  

            if (!await userExists(user) || !user)
                throw "User does not exists!"

            if (!req.body.Name) //TODO TEAM EXISTS
                throw "No name provided!"

            const newTeam = {  Name: req.body.Name,  Members: [user] }
            teams.create(newTeam, (err, data) => sendResponse(res, err, data ) )
        }
        catch (err){
            sendResponse(res, err)
        } 
    }, 
    //DELETE /api/teams/:id
    delete: async (req, res) => {
        try {   
            const token = req.body.access_token || req.cookies.access_token
            const user = jwt.verify(token, secret).Username

            if (!await userExists(user) || !user)
                throw "User does not exists!"

            if (!req.params.id) //TODO TEAM EXISTS
                throw "No name provided!"

            //CHECK IF ADMIN OF TEAM
            const members = await getMembers(req.params.id)
            if (members[0] !== user)
                throw "You are not the team leader!"

            teams.deleteOne({ _id: req.params.id }, (err, {deletedCount}) => sendResponse(res, err, {deletedCount: deletedCount}) )
        }
        catch (err){
            sendResponse(res, err)
        } 
    },
    //GET /api/teams/:id
    read: (req, res) => { 
        const id = mongoose.Types.ObjectId(req.params.id);
        teams.findOne({ _id: id }, (err, data) => sendResponse(res, err, data) ) 
    },
    //GET /api/teams/find/:name
    find: (req, res) => {
        try {
            if (!req.query.Name) 
                throw "No name found!"
            let team = {}
            team["Name"] = new RegExp(req.query.Name, 'i')   
            boards.find( team, (err, data) => sendResponse(res, err, data) ) 
        }
        catch (err) {
            sendResponse(res, err)
        } 
    },
    //POST /api/teams/:id
    update: async (req, res) => {
        try {   
            let teamUpdate = {} 
            const teamId = req.params.id

            const token = req.body.access_token || req.cookies.access_token
            const adminUser = jwt.verify(token, secret).Username
            if (!adminUser || !await userExists(adminUser))
                throw "User does not exists!"
            
            if (!teamId) //TODO TEAM EXISTS
                throw "No name provided!"
                
            const members = await getMembers(teamId)         
            if (members[0] !== adminUser)
                throw "You are not the team leader!"
            
            const newUser = req.body.User
            if (newUser){
                if (!await userExists(newUser))
                    throw "User you want to add does not exists!"
                if (members.includes(newUser))
                    throw "User already in team!"
                teamUpdate["Members"] = [...members, newUser]
            }            

            // const boards = await getBoards(teamId)
            // const newBoard = req.body.Board
            // if (newBoard){
            //     if (!await boardExists(newBoard))
            //         throw "Board you want to add does not exists!"
            //     if (boards.includes(newBoard))
            //         throw "Board already of team!"
            //     teamUpdate["Members"] = [...members, newUser]
            // }   

              
            
            // const newMembers = [...members, addedUser]
            // teams.findOneAndUpdate(
            //     { _id: teamId }, 
            //     { Members: newMembers },
            //     (err, data) => sendResponse(res, err, {...data._doc, Members: newMembers})
            // )
        }
        catch (err){
            sendResponse(res, err)
        } 
    } 
}
module.exports = controller