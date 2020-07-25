const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({ 
    'First Name': String,
    'Last Name': String,
    Username: String,
    Email: String,
    Password: String,
    Verified: Boolean,
    Boards: [String]
});

module.exports = mongoose.model('users', userSchema, 'users')