import { BaseSocketEvent } from "../../utils/structures";
import DiscordClient from "../../client/client";
export default class UpdateEvent extends BaseSocketEvent {
	constructor() {
		super("update");
	}
	async run(client: DiscordClient, args: String) {
		console.log(args);
	}
}
