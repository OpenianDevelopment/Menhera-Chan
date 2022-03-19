const mongoose = require('mongoose');
const userWarn = mongoose.Schema({
    user: String,
    warn: String,
    mod: String,
    date: String

})
const warnSchema = mongoose.Schema({

    guild: String,
    warning: [userWarn]
})

module.exports = mongoose.model('warnings', warnSchema);