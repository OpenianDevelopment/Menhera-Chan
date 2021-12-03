"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.guildSettings = void 0;
const mongoose_1 = require("mongoose");
const guildSettingsSchema = new mongoose_1.Schema({
    guild_id: {
        unique: true,
        required: true,
        type: String,
    },
    antiSpamModule: Boolean,
    expModule: Boolean,
    newsModule: Boolean,
    welcomeModule: Boolean,
    inviteModule: Boolean,
});
exports.guildSettings = mongoose_1.model("GuildSettings", guildSettingsSchema);
