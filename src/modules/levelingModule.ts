import { Message, Snowflake } from "discord.js";
import DiscordClient from "../client/client";
import {
	getLevel,
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
		if (GuildXP.channels.includes(message.channel.id.toString())) return;
		const users = GuildXP.users.get(message.author.id);
		if (!users) return;
		if (users.level === 1500) return;
		if (message.createdTimestamp - users.lastTimestamp < GuildXP.cooldown)
			return;
		const newXP = users.CurrXP + GuildXP.xpIncrement;
		const newTimestamp = message.createdTimestamp;
		const newLevel = Math.floor(Math.sqrt(newXP) * 0.1);
		GuildXP.users.set(message.guild.id, {
			CurrXP: newXP,
			level: newLevel,
			lastTimestamp: newTimestamp,
		});
		if (newLevel !== users.level) {
			sendLevelUpMessage(client, message, newLevel);
		}
		updateUserXP(message.author.id, newXP, newLevel, message.guild.id);
	} else {
		const GuildUsersXP = await getLevel(message.guild?.id);

		const userXP = GuildUsersXP.users.find((e) => {
			return e.user === message.author.id;
		});

		if (!userXP) {
			initUserXP(message.author.id, message.guild?.id);
			return;
		}
		if (!client.guildXP.has(message.guild.id)) {
			const users = new Map<Snowflake, userXP>().set(message.author.id, {
				CurrXP: userXP.xp,
				level: userXP.level,
				lastTimestamp: message.createdTimestamp,
			});

			client.guildXP.set(message.guild.id, {
				users: users,
				channels: GuildUsersXP.channels,
				log: GuildUsersXP.log,
				cooldown: GuildUsersXP.cooldown,
				xpIncrement: GuildUsersXP.xpIncrement,
			});
		} else {
			const guildXP = client.guildXP.get(message.guild.id);
			if (guildXP) {
				guildXP.users.set(message.author.id, {
					CurrXP: userXP.xp,
					level: userXP.level,
					lastTimestamp: message.createdTimestamp,
				});
			}
		}
	}
}
