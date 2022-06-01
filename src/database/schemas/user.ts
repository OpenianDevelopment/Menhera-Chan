import { Schema, model } from "mongoose";

const UserData = new Schema({
    id: { type: String, unique: true },
    tag: String,
    avatarHash: String,
});

export const user = model("user", UserData);
