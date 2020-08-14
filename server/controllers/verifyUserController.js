const users = require('../models/userModel')
const nodemailer = require('nodemailer')
const jwt = require('jsonwebtoken')
const {sendResponse} = require('./auxiliaryFunctions')

const verifyUserController = {
    // modifica sa verifice JWT nu id decriptat
    checkAuth: (req, res) => {
        try {
            if (req.query.token === undefined)
                throw "Invalid token"

            const userId = jwt.verify(req.query.token, process.env.secretToken || require('../secrets/jwt-token')) 
            
            users.findOneAndUpdate(
                { _id: userId._id },
                { Verified: true },
                (err, data) => sendResponse(res, err, data)
            )
        }
        catch (err) {
            sendResponse(res, err)
        }
    },
    resendMail: (req, res) => {
        users.findOne({ $or: [{ Email: req.body.Email }, { Username: req.body.Email }] }, (err, data) => {
            if (err) sendResponse(res, err, data)
            else if (data.Verified === true) {
                res.send({ success: true, msg: "Already verified" })
            } else {
                var new_user_token = jwt.sign({_id: data._id}, process.env.secretToken || require('../secrets/jwt-token'),{expiresIn:"30d"});

                const transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: 'brolloApp@gmail.com',
                        pass: process.env.BROLLO_PASSWORD ? process.env.BROLLO_PASSWORD : require('../secrets/brollo_password_secret')
                    }
                })
                transporter.sendMail({
                    from: 'brolloApp@gmail.com',
                    to: data.Email,
                    subject: 'Brollo Account Confirmation',
                    text: `Re-verification Link: http://localhost:5000/api/verifyUser?token=${new_user_token}`
                })

            }

        })
    }
}

module.exports = verifyUserController