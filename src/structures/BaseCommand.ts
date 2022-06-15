import DiscordClient from "../client/client";
import { CommandInteraction, Message } from "discord.js";

export default abstract class BaseInt {
    constructor(private _name: string, private _description: string) {}
    get name(): string {
        return this._name;
    }

    get description(): string {
        return this._description;
    }

    /**
     * Since BaseInteraction don't have all property we need it as CommandInteraction
     * @param client {DiscordClient}
     * @param interaction {CommandInteraction}
     */
    abstract run(
        client: DiscordClient,
        interaction: CommandInteraction
    ): void | Promise<void>;
}

export abstract class BaseMsg {
    constructor(
        private _name: string,
        private _description: string,
        private _requireArgs: boolean,
        private _aliases?: string[]
    ) {}

    get name(): string {
        return this._name;
    }

    get description(): string {
        return this._description;
    }

    get aliases(): string[] | undefined {
        return this._aliases;
    }

    get requireArgs(): boolean {
        return this._requireArgs;
    }

    /**
     * @param client {DiscordClient}
     * @param message {Message}
     */
    abstract run(
        client: DiscordClient,
        message: Message,
        args?: string[],
        [K]?: any
    ): (void | Message) | Promise<Message | void>;
}
