const users = require('../models/userModel')
const nodemailer = require('nodemailer')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const saltRounds = 10
const { sendResponse, isFieldUnique } = require('./auxiliaryFunctions')

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'brolloApp@gmail.com',
        pass: process.env.BROLLO_PASSWORD ? process.env.BROLLO_PASSWORD : require('../secrets/brollo_password_secret')
    }
})

const mailOptions = (new_user_email, new_user_token) => {
    return {
        from: 'brolloApp@gmail.com',
        to: new_user_email,
        subject: 'Brollo Account Confirmation',
        text: `Verification Link: http://localhost:5000/api/verifyUser?token=${new_user_token}`
    }
}

const controller = {
    register: async (req, res) => {
        try {
            const requiredKeys = ['First Name', 'Last Name', 'Username', 'Email', 'Password']

            // Check if all data was provided and only they the required keys
            let new_user = {}
            for (key of requiredKeys) {
                if (req.body[key] === undefined)
                    throw `${key} key is missing!`

                if (key === 'Password') {
                    const salt = bcrypt.genSaltSync(saltRounds)
                    new_user[key] = bcrypt.hashSync(req.body[key], salt)
                }
                else
                    new_user[key] = req.body[key]
            }
            new_user["Verified"] = false

            // Check if unique Username
            const usernameExists = await isFieldUnique({ 'Username': req.body['Username'] })
            if (usernameExists)
                throw "Username already taken!"

            // Check if unique Email
            const emailExists = await isFieldUnique({ 'Email': req.body['Email'] })
            if (emailExists)
                throw "Email already taken!"

            // Add user to db 
            users.create(new_user, (err, data) => {
                //Send verification email
                if (!err || err === undefined) {
                    const new_user_token = jwt.sign({ _id: data._id }, process.env.secretToken || require('../secrets/jwt-token'), { expiresIn: "30d" });
                    transporter.sendMail(mailOptions(new_user['Email'], new_user_token))
                    res.cookie('HomeNotLogged_message', 'Email verification link sent!')
                }
                sendResponse(res, err, data)
            })
        }
        catch (error) {
            sendResponse(res, error)
        }
    }
}
module.exports = controller