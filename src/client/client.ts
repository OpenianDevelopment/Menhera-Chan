import { Client, ClientOptions, Collection, Invite } from "discord.js";
import CommandInt from "../structures/BaseCommand";
import BaseEvent from "../structures/BaseEvent";
import { GuildSettings } from "../utils/interfaces/SettingsTypes";

export default class DiscordClient extends Client {
    private _commands = new Collection<string, CommandInt>();
    private _msgCommands = new Collection<string, CommandInt>();
    private _events = new Collection<string, BaseEvent>();
    private _guildSettings = new Collection<string, GuildSettings>();
    private _invites = new Collection<string, Invite[]>();
    constructor(options: ClientOptions) {
        super(options);
    }

    get commands(): Collection<string, CommandInt> {
        return this._commands;
    }
    /**
     * Get Message commands
     */
    get msgCommands(): Collection<string, CommandInt> {
        return this._msgCommands;
    }
    get events(): Collection<string, BaseEvent> {
        return this._events;
    }
    get guildSettings(): Collection<string, GuildSettings> {
        return this._guildSettings;
    }
    get invites(): Collection<string, Invite[]> {
        return this._invites;
    }
    getInvites(guildId: string): Invite[] | undefined {
        return this._invites.get(guildId);
    }
}
