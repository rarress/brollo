const users = require('../models/userModel')
const bcrypt = require('bcrypt')
const nodemailer = require('nodemailer')
const saltRounds = 10

const sendResponse = (res, err, data) => {
    if (err)
        res.json({ success: false, message: err })
    else if (!data || data.length == 0)
        res.json({ success: false, message: "Not Found" })
    else 
        res.json({ success: true, data: data })
}  

const isFieldUnique = (object) => new Promise( 
    (resolve, reject) => users.findOne(object).exec((err, data) => data? resolve(true) : resolve(false))
) 

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'brolloApp@gmail.com',
      pass: '}FyKz4uB-p)HV8^%DzpJu"sMzwNqyz[RCJq]p}+~4THDc>8X64'
    }
})
  
const mailOptions = (email) => { 
    return {
        from: 'brolloApp@gmail.com',
        to: email,
        subject: 'Brollo Account Confirmation',
        text: 'TODO: ADD LINK!'
    }
}
  
const controller = {
    register: async (req, res) => {
        try {
            const requiredKeys = ['First Name', 'Last Name', 'Username', 'Email', 'Password']

            // Check if all data was provided and only they the required keys
            let new_user = {}  
            for ( key of requiredKeys ) 
            {
                if ( req.body[key] === undefined )
                    throw `${key} key is missing!`

                if ( key === 'Password' ) { 
                    const salt = bcrypt.genSaltSync(saltRounds)
                    const test = bcrypt.hashSync(req.body[key], salt)
                    console.log(test)
                    new_user[key] = test
                    console.log("aaa")
                }
                else
                    new_user[key] = req.body[key] 
            }
            
            // Check if unique Username
            const usernameExists = await isFieldUnique( {'Username': req.body['Username']} ) 
            if (usernameExists)
                throw "Username already taken!"

            // Check if unique Email
            const emailExists = await isFieldUnique( {'Email': req.body['Email']} )
            if (emailExists)
                throw "Email already taken!" 
 
            // Add user to db 
            users.create( new_user, (err, data) => {
                if (!err || err === undefined) 
                    transporter.sendMail(mailOptions(new_user['Email']))
                sendResponse(res, err, data)
            }) 
        }
        catch(error){
            sendResponse(res, error)  
        }   
    }
}
module.exports = controller;