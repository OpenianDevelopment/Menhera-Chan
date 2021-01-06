const mongoose = require('mongoose');
const newsSchema = new mongoose.Schema({
    guild: String,
    channels: Array
})

module.exports = mongoose.model('news',newsSchema);