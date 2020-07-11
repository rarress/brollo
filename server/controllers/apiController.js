const mongoose = require('mongoose')
const users = require('../models/userModel')

const sendResponse = (res,err,data) => {
    if (err){
        res.json({ success: false, message: err })
    } 
    else if (!data || data.length == 0){
        res.json({ success: false, message: "Not Found" })
    } 
    else {
        res.json({success: true, data: data})
    }
}  

const controller = {
    random: (req, res) => { 
        res.json({data: "random data"})
    },
    register: (req, res) => {
        try {
            const requiredKeys = ['FirstName', 'LastName', 'Username', 'Email', 'Password']
            let new_user = {}
            console.log(req.body)
            requiredKeys.forEach(key => {
                if (req.body[key] === undefined)
                    throw key
                new_user[key] = req.body[key]
            })
            console.log(new_user)
            users.create(
                new_user,
                (err, data) => sendResponse(res, err, data)
            )
        }
        catch(err){
            console.log(err)
            res.sendStatus(400)
        }
    }
}
module.exports = controller;