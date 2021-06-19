import { BaseEvent } from "../../utils/structures";
import DiscordClient from "../../client/client";
import {} from "discord.js";
export default class RawEvent extends BaseEvent {
	constructor() {
		super("raw");
	}
	async run(client: DiscordClient, raw: any) {
		client.manager.updateVoiceState(raw);
	}
}
