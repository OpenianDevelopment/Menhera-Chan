import { Message, MessageEmbed } from "discord.js";
import DiscordClient from "../../client/client";
import { getLevel } from "../../database/functions/levelingOperation";
import { getRankCard } from "../../utils/functions/levelingFunctions";
import { BaseCommand } from "../../utils/structures";

export default class RankCommand extends BaseCommand {
	constructor() {
		super(
			"rank",
			"Get user Rank Card",
			"leveling",
			["r", "level"],
			"rank [user]",
			"rank"
		);
	}
	async run(client: DiscordClient, message: Message, args: Array<String>) {
		const member = message.mentions.users.first() || message.author;
		const GuildUsersXP = await getLevel(message.guild?.id);
		const userIndex = GuildUsersXP.findIndex((e) => {
			e.user === member.id;
		});
		const rankCard = await getRankCard(
			member,
			GuildUsersXP[userIndex],
			userIndex + 1
		);
	}
}
