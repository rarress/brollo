const users = require('../models/userModel')
const bcrypt = require('bcrypt')

const checkData = async (req,res) =>{
      await users.findOne({$or: [ {Email: req.body.Email},{Username: req.body.Email} ]} ,(err,data) => {
            if(err) 
                res.json({success:false, message:err})
            else if (!data) 
                    res.json({success:false,message:`Can't find username/email`})
                    else {
                        bcrypt.compare( req.body.Password,data.Password, function(err, result) {
                            if(result) {
                                if(data.Verified)
                                res.json({success:true ,verified:true, message: 'Success' })
                                     else 
                                res.json({success:true ,verified:false, message: `Your account has not been verified`})
                            } else {
                                res.json({success:false,message:'Wrong Password!'})
                            }
                            
                        });
                    }
      } )
 
}

const loginController = (req,res) => {
    checkData(req,res)

}

module.exports = loginController
