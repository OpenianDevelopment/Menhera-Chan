const mongoose = require('mongoose');
const channelSchema = mongoose.Schema({
    channel: String
})

const guildBlackList = mongoose.Schema({
    guild: String,
    channels: [channelSchema]
})

module.exports = mongoose.model('xpblacklist', guildBlackList);