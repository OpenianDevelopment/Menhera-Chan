import { Client, ClientOptions, Collection } from "discord.js";
import BaseCommand from "../structures/BaseCommand";
import BaseEvent from "../structures/BaseEvent";
import { GuildSettings } from "../utils/interfaces/GlobalType";

export default class DiscordClient extends Client {
    private _commands = new Collection<string, BaseCommand>();
    private _events = new Collection<string, BaseEvent>();
    private _guildSettings = new Collection<string, GuildSettings>();
    constructor(options: ClientOptions) {
        super(options);
    }

    get commands(): Collection<string, BaseCommand> {
        return this._commands;
    }
    get events(): Collection<string, BaseEvent> {
        return this._events;
    }
    get guildSettings(): Collection<string, GuildSettings> {
        return this._guildSettings;
    }
}
