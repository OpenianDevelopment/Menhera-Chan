import DiscordClient from "../client/client";

export default abstract class BaseEvent {
    constructor(private _name: string) {}

    get name(): string {
        return this._name;
    }

    abstract run(client: DiscordClient, ...args: any): void;
}
