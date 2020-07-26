const boards = require('../models/boardsModel')
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

const getUser = (req) => { 
    const token = req.body.access_token || req.cookies.access_token
    let user
    try {
        user = jwt.verify(token, secret).Username
    }
    catch {
        user = null
    }
    return user
} 

const getUserRights = async (boardId, user) => {
    const {Members} = await boards.findOne({ _id : boardId}).select('Members')
    for (let member of Members)
        if (member.Name === user) 
            return member.Rights
    return null
}

const controller = {
    //POST /api/boards
    create: async (req, res) => {
        try {   
            const user = getUser(req)

            if (!req.body.Name)
                throw "Missing Name!"  
            if (!user)
                throw "User Missing" 

            let newBoard = {
                "Name": req.body.Name,
                "Team": req.body.Team || null,
                "Members": [ {Name: user, Rights: 2} ],
                "BackgroundImage": req.body.BackgroundImage || "white",
            }
            
            boards.create( newBoard, (err, data) => sendResponse(res, err, data) ) 
        }
        catch (err) {
            sendResponse(res, err)
        } 
    },
    //GET /api/boards/:id
    read: (req, res) => { 
        const id = mongoose.Types.ObjectId(req.params.id);
        boards.findOne( { _id: id }, (err, data) => sendResponse(res, err, data) )  
    },
    //POST /api/boards/find (by boardname, member or both)
    find: (req, res) => {
        try {
            let board = {}
            if (!req.body.Name && !req.body.User) 
                throw "Invalid searching criteria"
            
            if (req.body.Name) 
                board["Name"] = new RegExp(req.body.Name, 'i') 

            if (req.body.User) 
                board["Members.Name"] = req.body.User 
            
            boards.find( board, (err, data) => sendResponse(res, err, data) ) 
        }
        catch (err) {
            sendResponse(res, err)
        } 
    },
    //GET /api/boards/:id/user/:user
    getUserInfo: async (req, res) => {  
        try{
            const {Members} = await boards.findOne({ _id : req.params.id}).select('Members')
            for (let member of Members)
                if (member.Name === req.params.user)
                {
                    sendResponse(res, null, member)
                    break
                }
            sendResponse(res, "User not found!")
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