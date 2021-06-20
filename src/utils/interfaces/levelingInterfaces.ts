export interface userXP {
	user: string;
	xp: number;
	level: number;
}

export interface guildXP {
	guild: string;
	users: Array<userXP>;
	channels: Array<string>;
	log: string;
	xpIncrement: number;
	cooldown: number;
}

export interface rankcardData {
	width: number;
	height: number;
	backgroundImage: string;
	trackColor: string;
	textColor: string;
	username: string;
	discrim: string;
	avatarURL: string;
	font: string;
	level: number;
	rank: number;
	xp: number;
	MinXP: number;
	MaxXP: number;
}
