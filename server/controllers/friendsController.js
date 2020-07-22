const friendsManager = require('../models/friendsManagerModel') 
const users = require('../models/userModel') 

const sendResponse = (res, err, data) => {
    if (err)
        res.json({ success: false, message: err })
    else if (!data || data.length == 0)
        res.json({ success: false, message: "Not Found" })
    else 
        res.json({ success: true, data: data })
}  

const relationExists = (user1, user2) => new Promise( resolve => {
    const find1 = {Receiver: user1, Sender: user2}
    const find2 = {Receiver: user2, Sender: user1}
    friendsManager.find( { $or: [find1, find2] } )
                  .exec( (err, data) => !data || data.length === 0? resolve(false) : resolve(true))
})

const userExists = (user) => new Promise( resolve => {
    users.find({Username: user}, (err, data) => !data || data.length === 0 ? resolve(false) : resolve(true) )
})

const controller = {
    addFriend: async (req, res) => {
        try {   
            const receiver = req.params.user
            const sender = req.body.user //todo use token instead 
            
            if (await relationExists(sender, receiver) === true) 
                throw "Could not send friend request!" 
 
            if (await userExists(sender) === false)
                throw "Sender does not exist!"

            if (await userExists(receiver) === false)
                throw "Receiver does not exist!"
            
            const newFriends = { Receiver: receiver, Sender: sender, Status: 0 }
            friendsManager.create(newFriends, (err, data) => sendResponse(res, err, data ) )
        }
        catch (err){
            sendResponse(res, err)
        } 
    }
}
module.exports = controller