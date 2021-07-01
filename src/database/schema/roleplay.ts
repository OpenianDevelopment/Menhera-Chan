import { Schema, model } from "mongoose";

const roleplaySchema = new Schema({
    type: {
        type: String,
        unique: true,
    },
    images: [String],
});

export const roleplay = model("roleplay", roleplaySchema);
