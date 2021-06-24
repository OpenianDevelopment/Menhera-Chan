import { Client, ClientOptions, Collection, Snowflake } from "discord.js";
import { BaseCommand, BaseEvent, BaseSocketEvent } from "../utils/structures";
import { Manager } from "erela.js";
import { initErela } from "../utils/registry";
import socketConnection from "../Plugins/socketConnection";
import { GuildXP, GuildAntispam } from "../utils/interfaces/generalInterfaces";
export default class DiscordClient extends Client {
	private _commands = new Collection<string, BaseCommand>();
	private _events = new Collection<string, BaseEvent>();
	private _socket_events = new Collection<string, BaseSocketEvent>();
	public guildConfig = new Map();
	public queue = new Map();
	public socket = socketConnection;
	public guildXP = new Map<Snowflake, GuildXP>();
	public guildAntispam = new Map<Snowflake, GuildAntispam>();
	public manager: Manager = initErela(this);
	constructor(options: ClientOptions) {
		super(options);
	}

	get commands(): Collection<string, BaseCommand> {
		return this._commands;
	}
	get events(): Collection<string, BaseEvent> {
		return this._events;
	}
	get socket_events(): Collection<string, BaseSocketEvent> {
		return this._socket_events;
	}
}
