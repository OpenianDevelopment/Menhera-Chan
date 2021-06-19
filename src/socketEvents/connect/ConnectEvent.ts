import { BaseSocketEvent } from "../../utils/structures";
import DiscordClient from "../../client/client";
export default class ConnectEvent extends BaseSocketEvent {
	constructor() {
		super("connect");
	}
	async run(client: DiscordClient) {
		console.log("connect");
	}
}
