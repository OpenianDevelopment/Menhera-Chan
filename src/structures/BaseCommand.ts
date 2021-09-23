import DiscordClient from "../client/client";
import { CommandInteraction, Message } from "discord.js";

export default abstract class BaseCommand {
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
