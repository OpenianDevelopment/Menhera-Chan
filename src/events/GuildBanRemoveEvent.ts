import BaseEvent from "../structures/BaseEvent";
import DiscordClient from "../client/client";
import { GuildBan, MessageEmbed } from "discord.js";
import { getAudituser, ModLog } from "../utils/functions/mod";

export default class Event extends BaseEvent {
    constructor() {
        super("guildBanRemove");
    }
    async run(client: DiscordClient, ban: GuildBan) {
        const data = await getAudituser(ban);
        let reason;
        if (ban.reason) {
            reason = ban.reason;
        } else {
            reason = "None Given";
        }
        const embed = new MessageEmbed()
            .setTitle("Unbanned")
            .setColor("RANDOM")
            .addFields(
                {
                    name: "user:",
                    value: `\`${ban.user.username}(${ban.user.id})\``,
                },
                data
            );
        ModLog(client, ban.guild.id, embed);
    }
}
