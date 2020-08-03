const users = require('../models/userModel')
const nodemailer = require('nodemailer')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const sendMail = async (recivier, token) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'brolloApp@gmail.com',
            pass: process.env.BROLLO_PASSWORD ? process.env.BROLLO_PASSWORD : require('../secrets/brollo_password_secret')
        }
    })

    let info = await transporter.sendMail({
        from: 'brolloApp@gmail.com', // sender address
        to: recivier, // list of receivers
        subject: "Brollo Reset Password", // Subject line
        text: `Click here to reset your password  \n http://localhost:3000/forgot/${token}`
    })
    console.log(info)
}


const hashPassword = (req) =>
    new Promise(resolve =>
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(req.body.Password, salt, (err, hash) => {
                resolve(hash)
            })
        })
    )




const controller = {
    verifyMail: async (req, res) => {
        await users.findOne({ $or: [{ Email: req.body.Email }, { Username: req.body.Email }] }, (err, data) => {
            if (err)
                res.json({ err })
            else if (!data)
                res.json({ success: false, message: "Wrong Email or Username" })
            else {
                var token = jwt.sign({ _id: data._id }, process.env.secretToken || require('../secrets/jwt-token'), { expiresIn: 60 * 60 })
                sendMail(data.Email, token)
                res.json({ success: true, message: `Email has been sent` })

            }
        })
    },
    checkToken: async (req, res) => {
        jwt.verify(req.body.token, process.env.JWT_SECRET || require('../secrets/jwt-token'), (err, user) => {
            if (err) res.json({ success: false, msg: err })
            else {
                res.json({ success: true, id: user._id })
            }
        })

    },
    changePass: async (req, res) => {
        jwt.verify(req.body.id, process.env.JWT_SECRET || require('../secrets/jwt-token'), (err, user) => {
            if (err) {
                console.log(err)
                res.json({ success: false, msg: err })
            }
            else {

                hashPassword(req).then(hashedPass => 
                users.findByIdAndUpdate(user._id, { Password: hashedPass }, (err, result) => {
                    if (err) {
                        console.log(err)
                        res.json({ success: false, msg: err })
                    }
                    else {
                        res.json({ success: true })
                    }
                }))
            }
        })
    }
}

module.exports = controller