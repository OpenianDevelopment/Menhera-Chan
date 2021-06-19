import { Types } from "mongoose";
//Warnings Interfaces
export interface GuildWarnings {
	_id: Types.ObjectId;
	warning: [userWarn];
}
export interface userWarn {
	_id: Types.ObjectId;
	user: string;
	warn: string;
	mod: string;
	date: string;
}
export interface moderation {
	user: string;
	username?: string;
	modtype: string;
	time: number;
}
