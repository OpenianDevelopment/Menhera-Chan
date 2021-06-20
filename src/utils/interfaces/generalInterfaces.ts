import { Snowflake } from "discord.js";

export interface guildConfig {
	prefix: string;
	logchannel: string;
	welcome: boolean;
	invite: boolean;
	xpsystem: boolean;
	muterole: boolean;
	antispam: boolean;
	newspublish: boolean;
}
export interface userXP {
	CurrXP: number;
	level: number;
	lastTimestamp: number;
}

export interface GuildXP {
	users: Map<Snowflake, userXP>;
	channels: Array<string>;
	log: string;
	xpIncrement: number;
	cooldown: number;
}
