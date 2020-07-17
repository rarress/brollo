const users = require('../models/userModel')
const bcrypt = require('bcrypt')
const saltRounds = 12

function sendResponse(res, err, data) {
    if (err)
        res.json({ success: false, message: err })
    else if (!data || data.length == 0)
        res.json({ success: false, message: "Not Found" })
    else 
        res.json({success: true, data: data})
}  

const isObjectUnique = (object) => new Promise( 
    (resolve, reject) => users.findOne(object).exec((err, data) => data? resolve(true) : resolve(false))
)

const encrpytPass = pass => new Promise ((resolve, reject) =>
    bcrypt.genSalt(saltRounds, (err, salt) => {
        if (err)
            reject (err)
        bcrypt.hash(pass, salt, (err, hash) => {
            if (err) 
                reject (err)
            else
                resolve (hash)
        })
    })
)


const controller = {
    random: (req, res) => { 
        res.json({data: "random data"})
    },
    register: async (req, res) => {
        try {
            const requiredKeys = ['First Name', 'Last Name', 'Username', 'Email', 'Password']

            // Check if all data was provided and only they the required keys
            let new_user = {} 
            for (key of requiredKeys) {
                if (req.body[key] === undefined)
                    throw `${key} key is missing!`

                new_user[key] = req.body[key]

                if (key === 'Password'){
            //        new_user[key] = await encrpytPass(req.body.key)
                }
            }
            
            // Check if unique Username
            const usernameExists = await checkIfExists( {'Username': req.body['Username']} ) 
            if (usernameExists)
                throw "Username already taken!"

            // Check if unique Email
            const emailExists = await checkIfExists( {'Email': req.body['Email']} )
            if (emailExists)
                throw "Email already taken!" 

            console.log(new_user)
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