const mongoose = require('mongoose');
const Waifu = new mongoose.Schema({
    id: Number,
    name: String,
    image: String,
    gender: String,
    anime: String,
    cost: String,
    wish: Number
})
module.exports = mongoose.model('waifu', Waifu)