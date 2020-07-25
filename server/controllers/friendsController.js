const friendsManager = require('../models/friendsModel') 
const users = require('../models/userModel') 
const jwt = require('jsonwebtoken');
let secret = require('../secrets/jwt-token') || process.env.jwt_secret

const sendResponse = (res, err, data) => {
    if (err)
        res.json({ success: false, message: err })
    else if (!data || data.length == 0)
        res.json({ success: false, message: "Not Found" })
    else 
        res.json({ success: true, data: data })
}  

const getRelation = (user1, user2) => new Promise( resolve => {
    const find1 = {Receiver: user1, Sender: user2}
    const find2 = {Receiver: user2, Sender: user1}
    friendsManager.find( { $or: [find1, find2] }, (err, data) => {
        if (err || data[0] === undefined) {
            resolve({
                Status: null
            })
        } else {
            resolve ({
                Sender: data[0].Sender,
                Receiver: data[0].Receiver,
                Status: data[0].Status
            }) 
        }
    })
})

const userExists = (user) => new Promise( resolve => {
    users.find({Username: user}, (err, data) => !data || data.length === 0 ? resolve(false) : resolve(true) )
})

const getUsers = (req) => {
    const paramUser = req.params.user
    const token = req.body.access_token || req.cookies.access_token
    let requestUser
    try {
        requestUser = jwt.verify(token, secret).Username
    }
    catch {
        requestUser = null
    }
    return [requestUser, paramUser]
}

const controller = {
    // POST /api/addFriend/:user  
        // >sender = req.cookies/req.body (aka sender=requestUser)
        // >receiver = <:user> (aka receiver=paramUser)
    add: async (req, res) => {
        try {   
            const [sender, receiver] = getUsers(req) 
            
            if (await userExists(sender) === false)
                throw "Sender does not exist!"

            if (await userExists(receiver) === false)
                throw "Receiver does not exist!"
            
            const relation = await getRelation(sender, receiver)
            switch (relation.Status){
                case 0:
                    if (relation.Sender === sender)
                        throw "Invite already sent!"
                    else
                        throw "Use /api/acceptFriend/:user to accept his friend request!"
                case -1:
                    if (relation.Sender === sender)
                        throw "You have blocked this user!"
                    else
                        throw "This user has blocked you!" 
                case 1:
                    throw "You are already friends!"
            } 
            
            const newFriends = {  Sender: sender, Receiver: receiver, Status: 0 }
            friendsManager.create(newFriends, (err, data) => sendResponse(res, err, data ) )
        }
        catch (err){
            sendResponse(res, err)
        } 
    },
    // POST /api/acceptFriend/:user  
        // >receiver = req.cookies/req.body (aka receiver=requestUser)
        // >sender = <:user> (aka sender=paramUser)
    accept: async (req, res) => { 
        try {   
            const [receiver, sender] = getUsers(req)

            if (await userExists(sender) === false)
                throw "Sender does not exist!"

            if (await userExists(receiver) === false)
                throw "Receiver does not exist!"

            const relation = await getRelation(sender, receiver)
            switch (relation.Status){
                case null: 
                    throw "No friend request found!"
                case 1:
                    throw "You are already friends!"
                case -1:
                    if (relation.Sender === sender)
                        throw "You have blocked this user!"
                    else
                        throw "This user has blocked you!" 
                case 0:
                    if (relation.Sender === receiver)
                        throw "The other user needs to accept it!"
            } 

            friendsManager.findOneAndUpdate(
                { Sender: relation.Sender, Receiver: relation.Receiver }, 
                { Status : 1},
                (err, data) => sendResponse(res, err, {...data._doc, Status: 1})
            )
        }
        catch (err){
            sendResponse(res, err)
        } 
    }
}
module.exports = controller