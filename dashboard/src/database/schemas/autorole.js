const mongoose = require('mongoose');

const RoleSchema = mongoose.Schema({
    guild: String,
    roles: Array
});

module.exports = mongoose.model('autorole',RoleSchema);