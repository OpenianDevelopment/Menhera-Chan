import BaseEvent from "../structures/BaseEvent";
import DiscordClient from "../client/client";
import { Guild } from "discord.js";
import { removeGuildSettings } from "../database/functions/GuildSettingsFunctions";
import { removeCacheGuildSettings } from "../utils/initialFunctions";

export default class GuildRemoveEvent extends BaseEvent {
    constructor() {
        super("guildDelete");
    }
    async run(client: DiscordClient, guild: Guild) {
        await removeGuildSettings(guild.id);
        removeCacheGuildSettings(client,guild.id)
        
    }
}
