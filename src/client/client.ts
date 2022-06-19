import { Client, ClientOptions, Collection } from "discord.js";
import BaseInt, {BaseMsg} from "../structures/BaseCommand";
import BaseEvent from "../structures/BaseEvent";
import { GuildSettings } from "../utils/interfaces/GlobalType";

export default class DiscordClient extends Client {
    private _commands = new Collection<string, BaseInt>();
    private _msgCommands = new Collection<string, BaseMsg>();
    private _events = new Collection<string, BaseEvent>();
    private _guildSettings = new Collection<string, GuildSettings>();
    constructor(options: ClientOptions) {
        super(options);
    }

    get commands(): Collection<string, BaseInt> {
        return this._commands;
    }
    /**
     * Get Message commands
     */
    get msgCommands(): Collection<string, BaseMsg> {
        return this._msgCommands;
    }
    get events(): Collection<string, BaseEvent> {
        return this._events;
    }
    get guildSettings(): Collection<string, GuildSettings> {
        return this._guildSettings;
    }
}