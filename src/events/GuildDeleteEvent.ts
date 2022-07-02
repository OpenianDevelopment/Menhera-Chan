import BaseEvent from "../structures/BaseEvent";
import DiscordClient from "../client/client";
import { Guild } from "discord.js";
import { removeGuildSettings } from "../database/functions/GuildSettingsFunctions";
import { removeCacheGuildSettings } from "../utils/initialFunctions";
import { delXP } from "../database/functions/levelingOperation";

export default class GuildRemoveEvent extends BaseEvent {
    constructor() {
        super("guildDelete");
    }
    async run(client: DiscordClient, guild: Guild) {
        // remove guild data
        await removeGuildSettings(guild.id);
        await delXP(guild.id);
        removeCacheGuildSettings(client, guild.id);
    }
}
