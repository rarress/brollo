const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({ 
    Nume: {type: String, required: true},
    Prenume: {type: String, required: true},
    Username: {type: String, required: true},
    Email: {type: String, required: true},
    Parola: {type: String, required: true},
    Verified: Boolean,
});

module.exports = mongoose.model('users', userSchema, 'users')