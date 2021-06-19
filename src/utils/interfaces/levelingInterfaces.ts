export interface userXP {
	user: string;
	xp: number;
	level: number;
	minxp: number;
	maxxp: number;
}

export interface guildXP {
	guild: string;
	users: userXP[];
}

export interface guildBlacklistChannel {
	guild: string;
	channels: string[];
}
