import { Message, MessageEmbed } from "discord.js";
import DiscordClient from "../../client/client";
import { checkMusicPermisison } from "../../utils/functions/musicFunctions";
import { BaseCommand } from "../../utils/structures";
export default class StopCommand extends BaseCommand {
	constructor() {
		super(
			"stop",
			"Stop the music and leave the channel",
			"music",
			[],
			"stop",
			"stop"
		);
	}

	async run(client: DiscordClient, message: Message, args: Array<string>) {
		if (!checkMusicPermisison(client, message)) return;
		const embed = new MessageEmbed()
			.setColor("#554b58")
			.setDescription("Player Stopped");
		const { player } = client.queue.get(message.guild?.id);
		player.disconnect();
		player.destroy();

		client.queue.delete(message.guild?.id);
		message.reply({ embeds: [embed] });
	}
}
