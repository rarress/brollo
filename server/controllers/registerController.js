const users = require('../models/userModel') 
const nodemailer = require('nodemailer')
const bcrypt = require('bcrypt')
const saltRounds = 10
const Cryptr = require('cryptr')
const cryptr = new Cryptr(process.env.CRYPTR_KEY? process.env.CRYPTR_KEY : require('../secrets/cryptr_key_secret'))

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
      pass: process.env.BROLLO_PASSWORD? process.env.BROLLO_PASSWORD : require('../secrets/brollo_password_secret')
    }
})
  
const mailOptions = (new_user_email, new_user_token) => { 
    return {
        from: 'brolloApp@gmail.com',
        to: new_user_email,
        subject: 'Brollo Account Confirmation',
        text: `Verification Link: http://127.0.0.1:5000/api/verifyUser?token=${new_user_token}`
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
                    new_user[key] = bcrypt.hashSync(req.body[key], salt)  
                }
                else
                    new_user[key] = req.body[key] 
            }
            new_user["Verified"] = false
            
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
                //Send verification email
                if (!err || err === undefined) {
                    const new_user_id = (data._id).toString() 
                    const new_user_token = cryptr.encrypt(new_user_id) 
                    transporter.sendMail(mailOptions(new_user['Email'], new_user_token))
                }
                sendResponse(res, err, data)
            }) 
        }
        catch(error){
            sendResponse(res, error)  
        }   
    }
}
module.exports = controller