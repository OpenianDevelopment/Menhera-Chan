import { User } from "discord.js";
import { Types, UpdateWriteOpResult } from "mongoose";
import { warnings, moderations } from "../schema";
import {
	GuildWarnings,
	userWarn,
} from "../../utils/interfaces/moderationInterfaces";

//Warning system function
export async function removeWarn(warnId: Types.ObjectId, guild?: string) {
	const delStatus: UpdateWriteOpResult = await warnings
		.updateOne({ guild }, { $pull: { warning: { _id: warnId } } })
		.catch((err: Error) => {
			return false;
		});
	if (delStatus.nModified === 0) return false;
	return true;
}
export async function addWarning(
	user: string,
	reason: string,
	moderator: string,
	guild?: string
) {
	const date = new Date().toUTCString();
	warnings
		.updateOne(
			{ guild },
			{
				$push: {
					warning: { user: user, warn: reason, mod: moderator, date: date },
				},
			}
		)
		.then((res: UpdateWriteOpResult) => {});
}

export async function getWarnings(user: string, guild?: string) {
	const warns = await warnings.findOne({ guild });

	if (!warns) return [];

	return warns.warning.filter((w: userWarn) => w.user === user);
}

export async function getWarningsOne(id: Types.ObjectId, guild?: string) {
	const warns: GuildWarnings = await warnings.findOne(
		{ guild, "warning._id": id },
		"warning.$"
	);
	if (!warns) return [];

	return warns.warning;
}

//Moderations Functions
export async function getModerations(guild?: string) {
	const ModerationsResults = await moderations.findOne({
		guild,
	});
	return ModerationsResults;
}
export async function addModerations(
	guild: string,
	user: User,
	modtype: string,
	time?: Number
) {
	const mute_id = Types.ObjectId();
	moderations
		.updateOne(
			{ guild },
			{
				$push: {
					moderations: {
						_id: mute_id,
						user: user.id,
						username: user.username,
						modtype: modtype,
						time: time,
					},
				},
			}
		)
		.then((res: any) => {});
	return mute_id;
}
export async function updateModerations(
	mute_id: Types.ObjectId,
	guild?: string
) {
	const modResult = await moderations.updateOne(
		{ guild },
		{ $pull: { moderations: { _id: mute_id } } }
	);
	if (modResult.nModified === 0) {
		return false;
	}
	return true;
}
