const mongoose = require('mongoose');
const guildSchema = mongoose.Schema({
    guild: String,
    prefix: String,
    logchannel: String,
    welcomechannel: String,
    invitelog: String,
    xplog: String,
    xpsystem: Number, 
    xp: Number,
    xpcooldown: Number,
    muterole: String,
    antispam: Number,
});

module.exports = mongoose.model('guildSettings',guildSchema);