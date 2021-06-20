import { Schema, model } from "mongoose";

const userSchema = new Schema({
	user: {
		type: String,
		unique: true,
	},
	xp: Number,
	level: Number,
});

const xpSchema = new Schema({
	guild: {
		type: String,
		unique: true,
	},
	users: [userSchema],
	channels: [String],
	log: String,
	xpIncrement: Number,
	cooldown: Number,
});

export const LevelXP = model("LevelXP", xpSchema);
