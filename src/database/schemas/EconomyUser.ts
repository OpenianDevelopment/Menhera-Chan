import { Schema, model } from "mongoose";

const characterSchema = new Schema({
    characterId: String
})
const userSchema = new Schema({
    user: String,
    balance: Number,
    characters: [characterSchema]
})

export const economyUser = model('EconomyUser',userSchema)