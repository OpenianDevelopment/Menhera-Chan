import { Schema } from "mongoose";

const antispamSchema = new Schema({
	guild: {
		type: String,
		unique: true,
	},
	channels: [String],
	difference: Number,
	count: Number,
	mute: Boolean,
	warn: Boolean,
	delete: Boolean,
});
