import BaseEvent from "../structures/BaseEvent";
import DiscordClient from "../client/client";
import { Guild } from "discord.js";
import { addGuildSettings } from "../database/functions/GuildSettingsFunctions";
import { initXP } from "../database/functions/levelingOperation";

export default class GuildCreateEvent extends BaseEvent {
    constructor() {
        super("guildCreate");
    }

    async run(client: DiscordClient, guild: Guild) {
        await addGuildSettings(guild.id);
        await initXP(guild.id);
        // Don't wanna get ratelimit errors
        // client.user!.setActivity({
        //     name: `${client.guilds.cache.size} Servers`,
        //     type: "WATCHING",
        // });
    }
}
