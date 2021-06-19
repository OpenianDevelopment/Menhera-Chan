import { Message, MessageEmbed } from "discord.js";
import DiscordClient from "../../client/client";
import { checkMusicPermisison } from "../../utils/functions/musicFunctions";
import { BaseCommand } from "../../utils/structures";
export default class ShuffleCommand extends BaseCommand {
	constructor() {
		super("shuffle", "shuffle the queue", "music", [], "shuffle", "shuffle");
	}

	async run(client: DiscordClient, message: Message, args: Array<string>) {
		if (!checkMusicPermisison(client, message)) return;

		const embed = new MessageEmbed()
			.setColor("#554b58")
			.setDescription("Shuffled");
		const { player } = client.queue.get(message.guild?.id);
		player.queue.shuffle();
		message.reply({ embeds: [embed] });
	}
}
