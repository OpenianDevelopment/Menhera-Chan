import DiscordClient from "../../client/client";

export abstract class BaseEvent {
	constructor(private name: string) {}
	getName(): string {
		return this.name;
	}
	abstract run(client: DiscordClient, ...args: any): void;
}
