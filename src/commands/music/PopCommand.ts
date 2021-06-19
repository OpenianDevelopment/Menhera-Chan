import { Message, MessageEmbed } from "discord.js";
import DiscordClient from "../../client/client";
import { checkMusicPermisison } from "../../utils/functions/musicFunctions";
import { BaseCommand } from "../../utils/structures";
export default class PopCommand extends BaseCommand {
	constructor() {
		super("pop", "Add Pop filter", "music", [], "pop", "pop");
	}

	async run(client: DiscordClient, message: Message, args: Array<string>) {
		if (!checkMusicPermisison(client, message)) return;
		const { player } = client.queue.get(message.guild?.id);
		const embed = new MessageEmbed().setColor("#554b58");

		if (player.isPop) {
			player.reset();
			embed.setDescription("Pop filter Deactivated");
			message.reply({ embeds: [embed] });
			return;
		}
		player.reset();
		player.setPop();
		embed.setDescription("Pop filter Activated");
		message.reply({ embeds: [embed] });
	}
}
