import { Schema, model } from "mongoose";

const guildSchema = new Schema({
	guild: {
		type: String,
		unique: true,
	},
	prefix: String,
	logchannel: String,
	welcome: Boolean,
	invite: Boolean,
	xpsystem: Boolean,
	muterole: String,
	autoMod: Boolean,
	newspublish: Boolean,
});

export const guildSettings = model("guildSettings", guildSchema);
