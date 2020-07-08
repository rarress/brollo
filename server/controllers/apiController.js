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
    addUser: (req, res) => {
        const new_user = req.body 
        users.create(
            new_user,
            (err, data) => sendResponse(res, err, data)
        )
    }
}
module.exports = controller;