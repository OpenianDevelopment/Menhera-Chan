import { Message, MessageEmbed } from "discord.js";
import DiscordClient from "../../client/client";
import { checkMusicPermisison } from "../../utils/functions/musicFunctions";
import { BaseCommand } from "../../utils/structures";
export default class TreblebassCommand extends BaseCommand {
	constructor() {
		super(
			"treblebass",
			"Add treblebass filter",
			"music",
			["tb"],
			"treblebass",
			"treblebass"
		);
	}

	async run(client: DiscordClient, message: Message, args: Array<string>) {
		if (!checkMusicPermisison(client, message)) return;
		const { player } = client.queue.get(message.guild?.id);
		const embed = new MessageEmbed().setColor("#554b58");

		if (player.isTreblebass) {
			player.reset();
			embed.setDescription("Treblebass Deactivated");
			message.reply({ embeds: [embed] });
			return;
		}
		player.reset();
		player.setTreblebass();
		embed.setDescription("Treblebass Activated");
		message.reply({ embeds: [embed] });
	}
}
