import {
	guildSettings,
	LevelXP,
	moderations,
	warnings,
	xpblacklist,
} from "../schema";

function initGuildSettings(guild: string) {
	const newGuildSettings = new guildSettings({
		guild: guild,
		prefix: "mc!",
		logchannel: null,
		welcomechannel: null,
		invitelog: null,
		xplog: null,
		xpsystem: 0,
		xp: 1,
		xpcooldown: 8000,
		muterole: null,
		antispam: 0,
	});
	newGuildSettings.save().catch((err: Error) => {});
}

function initGuildXP(guild: string) {
	const newGuildXP = new LevelXP({
		guild: guild,
		users: [],
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

function initGuildXPBlacklists(guild: string) {
	const newGuildXPBlacklists = new xpblacklist({
		guild: guild,
		channels: [],
	});
	newGuildXPBlacklists.save().catch((err: Error) => {});
}

export default function initGuild(guild: string) {
	initGuildSettings(guild);
	initGuildXP(guild);
	initGuildWarnings(guild);
	initGuildModerations(guild);
	initGuildXPBlacklists(guild);
}
