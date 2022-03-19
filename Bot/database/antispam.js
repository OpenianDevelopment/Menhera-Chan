const mongoose = require('mongoose');
const antispamSchema = new mongoose.Schema({
    guild: String,
    channels: Array,
    difference: Number,
    count: Number,
    mute: String,
    warn: String,
    delete: String
})
module.exports = mongoose.model('antispam', antispamSchema)