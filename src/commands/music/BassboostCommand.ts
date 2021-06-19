import { Message, MessageEmbed } from "discord.js";
import DiscordClient from "../../client/client";
import { checkMusicPermisison } from "../../utils/functions/musicFunctions";
import { BaseCommand } from "../../utils/structures";
export default class BassCommand extends BaseCommand {
	constructor() {
		super("bassboost", "Boost bass", "music", ["bb"], "bassboost", "bassboost");
	}

	async run(client: DiscordClient, message: Message, args: Array<string>) {
		if (!checkMusicPermisison(client, message)) return;
		const { player } = client.queue.get(message.guild?.id);
		const embed = new MessageEmbed().setColor("#554b58");

		if (player.isBass) {
			player.reset();
			embed.setDescription("BassBoost Dectivated");
			message.reply({ embeds: [embed] });
			return;
		}
		player.reset();
		player.setBass();
		embed.setDescription("BassBoost Activated");
		message.reply({ embeds: [embed] });
	}
}
