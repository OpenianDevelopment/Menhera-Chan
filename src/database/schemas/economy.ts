import { Schema, model } from "mongoose";

const economySchema = new Schema({
    earning: Number,
    cooldown: Number
})

export const economy = model('economySettings',economySchema)