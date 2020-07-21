const users = require('../models/userModel') 
const Cryptr = require('cryptr')
const cryptr = new Cryptr(process.env.CRYPTR_KEY? process.env.CRYPTR_KEY : require('../secrets/cryptr_key_secret'))
const Cookie = require('js-cookie')

const sendResponse = (res, err, data) => {
    if (err || !data || data.length == 0) 
        res.redirect('/error')
    else {
        Cookie.set('HomeNotLogged_message', 'Email Verified!', { expires: 0.05 })
        res.redirect('/home')
    }
}  

const verifyUserController = {
    checkAuth: (req, res) => {
        try {
            const token = req.query.token
            if (token === undefined)
                throw "Invalid token"
            const userId = cryptr.decrypt(token)
            users.findOneAndUpdate(
                { _id : userId }, 
                { Verified : true},
                (err, data) => sendResponse(res, err, data)
            )
        }
        catch (err){
            sendResponse(res, err)
        } 
    }
}

module.exports = verifyUserController