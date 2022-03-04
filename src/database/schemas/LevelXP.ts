import { Schema, model } from "mongoose";

const userSchema = new Schema({
	user: {
		type: String,
		unique: true,
	},
	xp: Number,
	level: Number,
	background: String,
	opacity: Number,
	trackColor: String,
	textColor: String
});

const xpSchema = new Schema({
	guild: {
		type: String,
		unique: true,
	},
	users: [userSchema]
});

export const levelXp = model("LevelXP", xpSchema);
