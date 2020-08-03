const mongoose = require('mongoose');

const friendsSchema = new mongoose.Schema({ 
    Sender: String,
    Receiver: String,
    Status: Number, // -1=blocked, 0=pending, 1=friends
});

module.exports = mongoose.model('friendsManager', friendsSchema, 'friendsManager')