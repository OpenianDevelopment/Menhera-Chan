import { Schema, model } from "mongoose";

const guildData = new Schema({
    guildId: String,
    tags: [
        { name: String, reply: Boolean, content: String, embed: String },
    ],
});

export const tags = model("tags", guildData);
