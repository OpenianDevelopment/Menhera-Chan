const mongoose = require('mongoose');
const moderations = mongoose.Schema({
    user: String,
    modtype: String,
    time: Number

})
const ModSchema = mongoose.Schema({

    guild: String,
    moderations: [moderations]
})

module.exports = mongoose.model('moderations', ModSchema);