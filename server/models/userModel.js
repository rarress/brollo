const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({ 
    FirstName: String,
    LastName: String,
    Username: String,
    Email: String,
    Password: String,
    Verified: Boolean,
});

module.exports = mongoose.model('users', userSchema, 'users')