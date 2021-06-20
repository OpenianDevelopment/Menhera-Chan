import { Message } from "discord.js";
import DiscordClient from "../../client/client";
import { getLevel } from "../../database/functions/levelingOperation";
import { RankCard } from "../../images/rankCard";

import { userXP } from "../../utils/interfaces/levelingInterfaces";
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
		const usersXP = GuildUsersXP.users.sort(
			(a: userXP, b: userXP) => b.xp - a.xp
		);
		const userIndex = usersXP.findIndex((e) => {
			return e.user === member.id;
		});

		const rankcardData = new RankCard()
			.setUsername(message.author.username)
			.setDiscrim(message.author.discriminator)
			.setLevel(usersXP[userIndex].level)
			.setMinXP(Math.floor(Math.pow(usersXP[userIndex].level, 2) / 0.01))
			.setMaxXP(Math.floor(Math.pow(usersXP[userIndex].level + 1, 2) / 0.01))
			.setXP(usersXP[userIndex].xp)
			.setAvatar(message.author.displayAvatarURL({ format: "png" }));
		const rankcard = await rankcardData.build();
		message.reply({
			files: [rankcard],
		});
	}
}
