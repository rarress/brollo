const mongoose = require('mongoose');

const friendsManagerSchema = new mongoose.Schema({ 
    Sender: String,
    Receiver: String,
    Status: Number // -1=block, 0=pending, 1=accepted
});

module.exports = mongoose.model('friendsManager', friendsManagerSchema, 'friendsManager')