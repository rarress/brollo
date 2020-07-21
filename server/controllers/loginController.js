const users = require('../models/userModel')
const bcrypt = require('bcrypt')
 
var jwt = require('jsonwebtoken');

const checkData = async (req,res) =>{
      await users.findOne({$or: [ {Email: req.body.Email},{Username: req.body.Email} ]} ,(err,data) => {
            if(err) 
                res.json({success:false, message:err})
            else if (!data) 
                    res.json({success:false,message:`Can't find username/email`})
                    else {
                        bcrypt.compare( req.body.Password,data.Password, function(err, result) {
                            if(result) {
                                if(data.Verified) {
                                    var token = jwt.sign({ username: data.Username }, process.env.secretToken || require('../secrets/jwt-token'));
                                    var decoded = jwt.verify(token, require('../secrets/jwt-token'  ));
                                    res.cookie('access_token',token, {
                                        maxAge: 2592000000 , // 30 days
                                        secure:true,
                                        httpOnly:true
                                       
                                    })
                                    console.log('After Loggin: ' + req.cookies.access_token)
                                    console.log(decoded)
                                    
                                
                                res.json({success:true ,verified:true, message: 'Success' })
                                }
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
      console.log('Here login: ' + req.cookies.access_token)

   
}

module.exports = loginController
