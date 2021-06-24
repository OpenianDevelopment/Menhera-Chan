import { model, Schema } from "mongoose";

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
	deleteMsg: Boolean,
});

export const antispam = model("antispam", antispamSchema);
