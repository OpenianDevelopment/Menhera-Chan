import BaseEvent from "../structures/BaseEvent";
import DiscordClient from "../client/client";
import { Guild } from "discord.js";
import { addGuildSettings } from "../database/functions/GuildSettingsFunctions";
import { initXP } from "../database/functions/levelingOperation";
import { updateCacheGuildSettings } from "../utils/initialFunctions";

export default class GuildCreateEvent extends BaseEvent {
    constructor() {
        super("guildCreate");
    }

    async run(client: DiscordClient, guild: Guild) {
        // add initial guild data
        await addGuildSettings(guild.id);
        await initXP(guild.id);
        await updateCacheGuildSettings(client, guild.id);
    }
}
