import { Schema, model } from "mongoose";

const guildSchema = new Schema({
	guild: {
		type: String,
		unique: true,
	},
	prefix: String,
	logchannel: String,
	welcomechannel: String,
	invitelog: String,
	xplog: String,
	xpsystem: Number,
	xp: Number,
	xpcooldown: Number,
	muterole: String,
	antispam: Number,
});

export const guildSettings = model("guildSettings", guildSchema);
