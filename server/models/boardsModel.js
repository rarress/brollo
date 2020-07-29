const mongoose = require('mongoose')

const boardsSchema = new mongoose.Schema({ 
    Name: String,
    Team: String, // Name of team
    Members: [{
        Name: String, // Name of member
        Rights: Number, // 0=Read Only, 1=RDWR, 2=Admin right
    }], 
    Cardboards: [{
        Name: String, 
        Cards: [{
            Name: String, 
            Description: String,
            Labels: [String],
        }],
    }], 
    BackgroundImage: String,
})
module.exports = mongoose.model('boards', boardsSchema, 'boards')