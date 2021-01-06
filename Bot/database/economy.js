const mongoose = require('mongoose');
const economySchema = new mongoose.Schema({
    earning: Number,
    cooldown: Number
})

module.exports = mongoose.model('economySettings',economySchema)

