import { Schema, model } from "mongoose";

const Waifu = new Schema({
    id: Number,
    name: String,
    image: String,
    gender: String,
    anime: String,
    cost: String,
    wish: Number
})

export const waifu = model('waifu',Waifu)