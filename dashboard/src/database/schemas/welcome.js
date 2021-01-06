const mongoose = require('mongoose');

const welcomeSchema = mongoose.Schema({
    guild: String,
    msg: String,
    dm: String,
    image:String,
    welcomedm: Number,
    welcomemsg: Number,
    welcomeimage: Number
})

module.exports = mongoose.model('welcome', welcomeSchema);