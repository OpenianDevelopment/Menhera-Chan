import BaseEvent from "../structures/BaseEvent";
import DiscordClient from "../client/client";
import { Guild } from "discord.js";
import { addGuildSettings } from "../database/functions/GuildSettingsFunctions";

export default class GuildCreateEvent extends BaseEvent {
    constructor() {
        super("guildCreate");
    }

    async run(client: DiscordClient, guild: Guild) {
        await addGuildSettings(guild.id);
    }
}