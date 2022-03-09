import { Schema, model } from "mongoose";

const guildSettingsSchema = new Schema({
    guild_id: {
        type:String,
        unique: true,
        required: true,
    },
    expSettings:{
        enable:Boolean,
        increment:Number,
        timeDifference: Number,
        blacklistChannel: Array,
        expLogChannel: String
    },
    antiSpamSettings:{
        enable:Boolean,
        messageCount: Number,
        timeDifference: Number,
        antispamChannel: Array,
        warnUser: Boolean,
        muteUser: Boolean,
        deleteMessage: Boolean,
    },
    moderationSettings:{
        enable:Boolean,
        modLogChannel: String,
        modBlackList:Array,
        urlBlock:Boolean,
        urlWhiteList:Array
    },
    welcomeSettings:{
        enable:Boolean,
        welcomeDM: Boolean,
        welcomeChannelMessage: Boolean,
        welcomeChannel: String,
        welcomeMessage: String,
        welcomeRoles: Array,
    }
});

export const guildSettings = model("GuildSettings", guildSettingsSchema);
