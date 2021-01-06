const mongoose = require('mongoose');
const rpSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    mod: String,
    img: String
})

module.exports = mongoose.model('rp', rpSchema);