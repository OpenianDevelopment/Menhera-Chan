import { BaseEvent } from "../../utils/structures";
import DiscordClient from "../../client/client";
import initGuild from "../../database/functions/initFunctions";

export default class ReadyEvent extends BaseEvent {
	constructor() {
		super("ready");
	}
	async run(client: DiscordClient) {
		console.log("Bot has logged in.");
		client.manager.init(client.user?.id);
		const guilds = client.guilds.cache.array();
		for (const guild of guilds) {
			initGuild(guild.id);
		}
	}
}
