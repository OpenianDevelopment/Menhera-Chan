import { Schema, model } from "mongoose";

const devMiscSchema = new Schema({
    id: String,
    economy: { earning: Number, cooldown: Number },
    blacklists: [
        {
            user: { type: Schema.Types.ObjectId, ref: "user" },
            blacklistedAt: { unix: Number, string: String },
            reason: String,
        },
    ],
});

export const devMisc = model("DevMisc", devMiscSchema);
