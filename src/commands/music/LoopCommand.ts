import { Message, MessageEmbed } from "discord.js";
import DiscordClient from "../../client/client";
import { checkMusicPermisison } from "../../utils/functions/musicFunctions";
import { BaseCommand } from "../../utils/structures";

export default class LoopCommand extends BaseCommand {
	constructor() {
		super("loop", "Loop the queue", "music", [], "loop", "loop");
	}

	async run(client: DiscordClient, message: Message, args: Array<string>) {
		if (!checkMusicPermisison(client, message)) return;
		const embed = new MessageEmbed().setColor("#554b58");
		const { player } = client.queue.get(message.guild?.id);
		if (player.queueRepeat) {
			embed.setDescription("Loop is off");
		} else {
			embed.setDescription("Loop is on");
		}
		player.setQueueRepeat(!player.queueRepeat);
		message.reply({ embeds: [embed] });
	}
}
