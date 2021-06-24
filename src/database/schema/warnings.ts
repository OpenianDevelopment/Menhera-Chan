import {Schema, model} from "mongoose";

const userWarnSchema = new Schema({
    user: String,
    warn: String,
    mod: String,
    date: String
});

const warnSchema = new Schema({
    guild: {
        type: String,
        unique: true,
    },
    warning: [userWarnSchema]
});

export const warnings = model("warnings", warnSchema);
