import { Schema, model } from "mongoose";

const UserData = new Schema({
    id: { type: String, unique: true },
    tag: String,
    avatarHash: String,
    guilds: [
        { type: Schema.Types.ObjectId, unique: true, ref: "GuildSettings" },
    ],
});

export const user = model("user", UserData);
