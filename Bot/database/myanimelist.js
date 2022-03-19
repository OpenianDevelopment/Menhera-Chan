const mongoose = require('mongoose');

var MalProfileSchema = mongoose.Schema({
    username: String,
    user: String
})

module.exports = mongoose.model('malProfile', MalProfileSchema);