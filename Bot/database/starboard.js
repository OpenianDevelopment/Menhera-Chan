const mongoose = require('mongoose');
const messages = mongoose.Schema({
    channel: String,
    message: String,
    posted_message: String,
    starCount: Number
})

const starboard = mongoose.Schema({
    guild: String,
    channel: String,
    messages: [messages]
})

module.exports = mongoose.model('starboard', starboard);