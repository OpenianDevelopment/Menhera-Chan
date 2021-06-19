import DiscordClient from "../../client/client";

export abstract class BaseSocketEvent {
	constructor(private name: string) {}
	getName(): string {
		return this.name;
	}
	abstract run(client: DiscordClient, ...args: any): void;
}
