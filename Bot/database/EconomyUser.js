const { Schema } = require("mongoose");

const mongoose = require('mongoose');
const characterSchema = new mongoose.Schema({
    characterId: String,
    name: String,
    cost: Number
})
const userSchema = new mongoose.Schema({
    user: String,
    username: String,
    balance: Number,
    characters: [characterSchema]
})


module.exports = mongoose.model('EconomyUser',userSchema)

