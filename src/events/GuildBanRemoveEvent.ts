import BaseEvent from "../structures/BaseEvent";
import DiscordClient from "../client/client";
import { GuildBan } from "discord.js";

export default class Event extends BaseEvent {
    constructor() {
        super("guildBanRemove");
    }
    async run(client: DiscordClient,ban:GuildBan) {
        
    }
}