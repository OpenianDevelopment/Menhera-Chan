const mongoose = require('mongoose');
const userSchema = mongoose.Schema({
    user: String,
    xp: Number,
    level: Number,
    minxp: Number,
    maxxp: Number 
})

const xpSchema = mongoose.Schema({
    guild: String,
    users: [userSchema]
})

module.exports = mongoose.model('LevelXP', xpSchema);