import { Message, MessageEmbed } from "discord.js";
import DiscordClient from "../../client/client";
import { BaseCommand } from "../../utils/structures";

export default class PingCommand extends BaseCommand {
	constructor() {
		super("ping", "Calculate ping", "info", [], "ping", "ping");
	}
	async run(client: DiscordClient, message: Message, args: Array<String>) {
		message.reply("Calculating Ping").then((msg) => {
			const embed = new MessageEmbed()
				.setColor("#554b58")
				.setTitle("Ping")
				.addField(
					"Message Ping:",
					String(Math.floor(msg.createdTimestamp - message.createdTimestamp)),
					true
				)
				.addField("Discord Latency:", String(Math.round(client.ws.ping)), true);
			msg.edit({ embeds: [embed] });
		});
	}
}
