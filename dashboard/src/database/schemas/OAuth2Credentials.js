const mongoose = require('mongoose');

const OAuth2CredentialsSchema = new mongoose.Schema({
    discordId: String,
    accessToken: String,
    refreshToken: String
})

module.exports = mongoose.model('OAuth2Credentials',OAuth2CredentialsSchema)