import { BaseEvent } from "../../utils/structures";
import { Message } from "discord.js";
import DiscordClient from "../../client/client";
import addXP from "../../modules/levelingModule";

export default class MessageEvent extends BaseEvent {
	constructor() {
		super("message");
	}

	async run(client: DiscordClient, message: Message) {
		if (message.channel.type === "dm") return;
		if (message.author.bot) return;

		const { prefix, xpsystem } = client.guildConfig.get(message.guild?.id);

		if (xpsystem === 1) addXP(client, message);
		if (message.content.startsWith(prefix)) {
			const [cmdName, ...cmdArgs] = message.content
				.slice(prefix.length)
				.trim()
				.split(/\s+/);
			const command = client.commands.get(cmdName.toLowerCase());
			if (command) {
				command.run(client, message, cmdArgs);
			}
		}
	}
}
