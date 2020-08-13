const mongoose = require('mongoose');

const teamsSchema = new mongoose.Schema({ 
    Name: String,
    Members: [String], //first member = leader
    Boards: [String]
});

module.exports = mongoose.model('teams', teamsSchema, 'teams')