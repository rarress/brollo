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

const checkIfExists = (obj) => 
    new Promise ( (resolve, reject) =>
        users.findOne( obj ).exec( (err, data) => { 
            if (err)
                reject(err)
            else if(data) 
                resolve(true) 
            else 
                resolve(false)
        })
    )

const controller = {

    random: (req, res) => { 
        res.json({data: "random data"})
    },

    // TODO: send email + encrpy password
    register: async (req, res) => {
        try {
            const requiredKeys = ['First Name', 'Last Name', 'Username', 'Email', 'Password']

            // Check if all data was provided and only they the required keys
            let new_user = {} 
            requiredKeys.forEach(key => {
                if (req.body[key] === undefined)
                    throw `${key} key is missing!`
                new_user[key] = req.body[key]
            })
            
            // Check if unique Username
            const usernameExists = await checkIfExists( {'Username': req.body['Username']} ) 
            if (usernameExists)
                throw "Username already taken!"

            // Check if unique Email
            const emailExists = await checkIfExists( {'Email': req.body['Email']} )
            if (emailExists)
                throw "Email already taken!" 

            // Add user to db
            users.create(
                new_user,
                (err, data) => sendResponse(res, err, data)
            )
        }
        catch(error){
            sendResponse(res, error)  
        }   
    }
}
module.exports = controller;