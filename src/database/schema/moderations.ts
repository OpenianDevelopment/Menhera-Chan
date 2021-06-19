import { model, Schema } from "mongoose";

const moderationSchema = new Schema({
	user: String,
	username: String,
	modtype: String,
	time: Number,
});

const ModSchema = new Schema({
	guild: {
		type: String,
		unique: true,
	},
	moderations: [moderationSchema],
});

export const moderations = model("moderations", ModSchema);
