const boards = require('../models/boardsModel')
const mongoose = require('mongoose') 
const teamsController = require('./teamsController')
const {sendResponse, getUser, getUserRights, teamExists, getTeamMembers, boardExists, getBoardMembers} = require('./auxiliaryFunctions') 

const addMembers = (members) => {

}

const controller = {
    //POST /api/boards
    create: async (req, res) => {
        try {   
            const user = getUser(req)
            
            if (!user)
                throw "User Missing" 

            if (!req.body.Name)
                throw "Missing Name!"  

            if (await boardExists(req.body.Name))
                throw "Board already exists!"

            let newBoard = {
                "Name": req.body.Name,
                "Team": null,
                "Members": [ {Name: user, Rights: 2} ],
                "BackgroundImage": req.body.BackgroundImage || "white.png",
            }

            //Add team + members of it
            if (req.body.Team) { 
                if (!await teamExists(req.body.Team))
                    throw "Team does not exist!"

                newBoard["Team"] = req.body.Team

                const members = await getTeamMembers(req.body.Team) 
                newBoard["Members"] = members.map(member => { 
                    return {Name: member, Rights: member === user? 2 : 1}
                })   
            } 

            boards.create( newBoard, (err, data) => sendResponse(res, err, data) ) 
        }
        catch (err) {
            sendResponse(res, err)
        } 
    },
    //GET /api/boards/:id
    read: (req, res) => { 
        //TODO CHECK IF YOU HAVE RIGHTS TO SEE THIS
        if (mongoose.Types.ObjectId.isValid(req.params.id))
            boards.findOne( { _id: req.params.id }, (err, data) => sendResponse(res, err, data) )  
        else
            boards.findOne( { Name: req.params.id }, (err, data) => sendResponse(res, err, data) )  
    },
    //GET /api/boards?Name=..&User=...
    find: (req, res) => { 
        //TODO CHECK IF YOU HAVE RIGHTS TO SEE THIS
        try {
            let board = {}
            if (!req.query.Name && !req.query.User) 
                throw "Invalid searching criteria"
            
            if (req.query.Name) 
                board["Name"] = new RegExp(req.query.Name, 'i') 

            if (req.query.User) 
                board["Members.Name"] = req.query.User 
            
            boards.find( board, (err, data) => err || !data[0]? sendResponse(res, err) : sendResponse(res, err, data[0].Name) ) 
        }
        catch (err) {
            sendResponse(res, err)
        } 
    },
    //GET /api/boards/:name/user/:user
    getUserInfo: async (req, res) => {   
        try{
            const members = await getBoardMembers(req.params.id) 
            for (let member of members)
                if (member.Name === req.params.user)
                {
                    sendResponse(res, null, member)
                    return
                }
            sendResponse(res, "User not found!")
        }
        catch (err) {
            sendResponse(res, err)
        }
    },
    //PATCH /api/boards/:id
    update: async (req, res) => {
        try{
            //TODO FINISH THIS
            const newMembers = req.body.Members
            const newLeader = req.body.NewLeader
            const newBackground = req.body.BackgroundImage
            console.log(newMembers)
            throw "all good"
        }
        catch (err) {
            sendResponse(res, err)
        }
    },
    //DELETE /api/boards/:id
    delete: async (req, res) => {
        try{
            const user = getUser(req)

            if (!user)
                throw "User Missing" 

            if (await getUserRights(req.params.id, user) !== 2)
                throw "User does not have authorization!"

            boards.deleteOne({_id: req.params.id}, (err, {deletedCount}) => sendResponse(res, err, {deletedCount: deletedCount}) )
        }
        catch (err) {
            sendResponse(res, err)
        }
    }
}
module.exports = controller