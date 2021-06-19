import { Message, PermissionResolvable } from "discord.js";
import DiscordClient from "../../client/client";

export abstract class BaseCommand {
	constructor(
		private name: String,
		private description: String,
		private category: String,
		private aliases: Array<String>,
		private usage: String,
		private example: String
	) // private botPermission: PermissionResolvable,
	// private userPermission: PermissionResolvable
	{}

	getName(): String {
		return this.name;
	}
	getCategory(): String {
		return this.category;
	}
	getDescription(): String {
		return this.description;
	}
	getAliases(): Array<String> {
		return this.aliases;
	}
	getUsage(): String {
		return this.usage;
	}
	getExample(): String {
		return this.example;
	}
	// getBotPermission(): PermissionResolvable {
	// 	return this.botPermission;
	// }

	abstract run(
		client: DiscordClient,
		message: Message,
		args: Array<String> | null
	): Promise<void>;
}
