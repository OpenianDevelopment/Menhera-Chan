import DiscordClient from "../client/client";

export default abstract class BaseEvent {
    constructor(private _name: string) {}

    get name(): string {
        return this._name;
    }

    /**
     *
     * @param client {DiscordClient}
     * @param args {any}
     */
    abstract run(client: DiscordClient, ...args: any): void;
}
