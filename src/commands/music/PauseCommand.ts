import { Message, MessageEmbed } from "discord.js";
import DiscordClient from "../../client/client";
import { checkMusicPermisison } from "../../utils/functions/musicFunctions";
import { BaseCommand } from "../../utils/structures";

export default class PauseCommand extends BaseCommand {
	constructor() {
		super("pause", "pause the music player", "music", [], "pause", "pause");
	}
	async run(client: DiscordClient, message: Message, args: Array<string>) {
		if (!checkMusicPermisison(client, message)) return;
		const embed = new MessageEmbed()
			.setColor("#554b58")
			.setDescription("Player Paused");
		const { player } = client.queue.get(message.guild?.id);
		if (player.paused) {
			message.reply("Music is not Playing");
			return;
		}
		player.pause(true);
		message.reply({ embeds: [embed] });
	}
}
