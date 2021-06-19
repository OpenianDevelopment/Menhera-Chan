import {
	guildBlacklistChannel,
	guildXP,
	userXP,
} from "../../utils/interfaces/levelingInterfaces";
import { LevelXP, xpblacklist } from "../schema";

export async function getLevel(guild?: string) {
	const guildXP: guildXP = await LevelXP.findOne({ guild });
	const usersXP = guildXP.users.sort((a: userXP, b: userXP) => b.xp - a.xp);
	return usersXP;
}

export async function getXPBlacklistChannel(guild?: string) {
	const blChannel: guildBlacklistChannel = await xpblacklist.findOne({ guild });
	return blChannel.channels;
}

export function updateUserXP(
	user: string,
	xp: number,
	level: number,
	minxp: Number,
	maxxp: Number,
	guild?: string
) {
	LevelXP.updateOne(
		{ guild, "users.user": user },
		{
			$set: {
				"users.$.xp": xp,
				"users.$.level": level,
				"users.$.minxp": minxp,
				"users.$.maxxp": maxxp,
			},
		}
	).catch((err: Error) => console.log(err));
}
export function initUserXP(user: string, guild?: string) {
	LevelXP.updateOne(
		{ guild },
		{
			$push: {
				user: user,
				xp: 0,
				level: 0,
				minxp: 0,
				maxxp: 100,
			},
		}
	).catch((err: Error) => {});
}
