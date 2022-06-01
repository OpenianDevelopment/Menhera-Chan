import { Schema, model } from "mongoose";

const userSchema = new Schema({
    id: String,
    userId: String,
    mod: String,
    reason: String,
    date: String,
});
const GuildData = new Schema({
    guildId: String,
    warnings: [userSchema],
});

export const warns = model("warnings", GuildData);
