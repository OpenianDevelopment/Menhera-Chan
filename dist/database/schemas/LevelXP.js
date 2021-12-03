"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.levelXp = void 0;
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    user: {
        type: String,
        unique: true,
    },
    xp: Number,
    level: Number,
    background: String,
    opacity: Number,
    trackColor: String,
    textColor: String
});
const xpSchema = new mongoose_1.Schema({
    guild: {
        type: String,
        unique: true,
    },
    users: [userSchema],
    channels: [String],
    log: String,
    xpIncrement: Number,
    cooldown: Number
});
exports.levelXp = mongoose_1.model("LevelXP", xpSchema);
