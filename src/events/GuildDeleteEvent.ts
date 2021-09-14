import BaseEvent from "../structures/BaseEvent";
import DiscordClient from "../client/client";
import { Guild } from "discord.js";
import { removeGuildSettings } from "../database/functions/GuildSettingsFunctions";

export default class GuildRemoveEvent extends BaseEvent {
    constructor() {
        super("guildDelete");
    }
    async run(client: DiscordClient, guild: Guild) {
        await removeGuildSettings(guild.id);
    }
}
