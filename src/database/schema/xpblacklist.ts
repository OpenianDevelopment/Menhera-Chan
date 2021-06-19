import { model, Schema } from "mongoose";

const guildBlacklistSchema = new Schema({
	guild: {
		type: String,
		unique: true,
	},
	channels: [String],
});

export const xpblacklist = model("xpblacklist", guildBlacklistSchema);
