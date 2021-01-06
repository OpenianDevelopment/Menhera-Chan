const mongoose = require('mongoose');
const blSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    id: String,
    mod: String
})

module.exports = mongoose.model('blacklist', blSchema);