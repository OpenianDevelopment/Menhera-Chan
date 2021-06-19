import { Snowflake } from "discord.js";

export interface guildConfig {
	prefix: string;
	logchannel: string;
	welcomechannel: string;
	invitelog: string;
	xplog: string;
	xpsystem: number;
	xp: number;
	xpcooldown: number;
	muterole: string;
	antispam: number;
}
export interface userXP {
	CurrXP: number;
	level: number;
	lastTimestamp: number;
}

export interface GuildXP {
	users: Map<Snowflake, userXP>;
	channels: Array<string>;
}
