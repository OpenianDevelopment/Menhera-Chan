import { Schema, model } from "mongoose";

const guildSettingsSchema = new Schema({
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

export const guildSettings = model("GuildSettings", guildSettingsSchema);
