import { Schema, model } from "mongoose";

const RolePlaySchema = new Schema({
    type: {
        unique: true,
        type: String,
    },
    images: [String],
});

export const rolePlay = model("RolePlay", RolePlaySchema);
