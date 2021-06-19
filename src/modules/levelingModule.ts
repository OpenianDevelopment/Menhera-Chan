import { Message, Snowflake } from "discord.js";
import DiscordClient from "../client/client";
import {
	getLevel,
	getXPBlacklistChannel,
	initUserXP,
	updateUserXP,
} from "../database/functions/levelingOperation";
import { sendLevelUpMessage } from "../utils/functions/levelingFunctions";
import { userXP } from "../utils/interfaces/generalInterfaces";

export default async function addXP(client: DiscordClient, message: Message) {
	if (!message.guild) return;
	if (
		client.guildXP.has(message.guild.id) &&
		client.guildXP.get(message.guild.id)?.users.has(message.author.id)
	) {
		const GuildXP = client.guildXP.get(message.guild.id);
		if (!GuildXP) return;
		if (GuildXP.channels.includes(message.channel.id)) return;
		const users = GuildXP.users.get(message.author.id);
		if (!users) return;
		if (users.level === 1500) return;
		const { xp, xpcooldown } = client.guildConfig.get(message.guild.id);
		if (message.createdTimestamp - users.lastTimestamp < xpcooldown) return;
		const newXP = users.CurrXP + xp;
		const newTimestamp = message.createdTimestamp;
		const newLevel = Math.floor(Math.sqrt(newXP) * 0.1);
		const newMinXP = Math.floor(Math.pow(newLevel, 2) / 0.01);
		const newMaxXP = Math.floor(Math.pow(newLevel + 1, 2) / 0.01);
		GuildXP.users.set(message.guild.id, {
			CurrXP: newXP,
			level: newLevel,
			lastTimestamp: newTimestamp,
		});
		if (newLevel !== users.level) {
			sendLevelUpMessage(client, message, newLevel);
		}
		updateUserXP(
			message.author.id,
			newXP,
			newLevel,
			newMinXP,
			newMaxXP,
			message.guild.id
		);
	} else {
		const GuildUsersXP = await getLevel(message.guild?.id);
		const userXPIndex = GuildUsersXP.findIndex((e) => {
			return e.user === message.author.id;
		});
		if (userXPIndex < 0) {
			initUserXP(message.author.id, message.guild?.id);
			return;
		}
		if (!client.guildXP.has(message.guild.id)) {
			const users = new Map<Snowflake, userXP>().set(message.author.id, {
				CurrXP: GuildUsersXP[userXPIndex].xp,
				level: GuildUsersXP[userXPIndex].level,
				lastTimestamp: message.createdTimestamp,
			});
			const channels = await getXPBlacklistChannel(message.guild.id);
			client.guildXP.set(message.guild.id, {
				users: users,
				channels: channels,
			});
		} else {
			const guildXP = client.guildXP.get(message.guild.id);
			if (guildXP) {
				guildXP.users.set(message.author.id, {
					CurrXP: GuildUsersXP[userXPIndex].xp,
					level: GuildUsersXP[userXPIndex].level,
					lastTimestamp: message.createdTimestamp,
				});
			}
		}
	}
}
