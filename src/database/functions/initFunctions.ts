import { guildSettings, LevelXP, moderations, warnings } from "../schema";

function initGuildSettings(guild: string) {
	const newGuildSettings = new guildSettings({
		guild: guild,
		prefix: "mc!",
		logchannel: null,
		welcome: false,
		invite: false,
		xpsystem: false,
		muterole: null,
		antispam: false,
		newspublish: false,
	});
	newGuildSettings.save().catch((err: Error) => {});
}

function initGuildXP(guild: string) {
	const newGuildXP = new LevelXP({
		guild: guild,
		users: [],
		channels: [],
		log: null,
		xpIncrement: 1,
		cooldown: 8000,
	});
	newGuildXP.save().catch((err: Error) => {});
}

function initGuildWarnings(guild: string) {
	const newGuildWarnings = new warnings({
		guild: guild,
		warning: [],
	});
	newGuildWarnings.save().catch((err: Error) => {});
}

function initGuildModerations(guild: string) {
	const newGuildModerations = new moderations({
		guild: guild,
		moderations: [],
	});
	newGuildModerations.save().catch((err: Error) => {});
}

export default function initGuild(guild: string) {
	initGuildSettings(guild);
	initGuildXP(guild);
	initGuildWarnings(guild);
	initGuildModerations(guild);
}
