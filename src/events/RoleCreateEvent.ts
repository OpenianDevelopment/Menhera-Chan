import BaseEvent from "../structures/BaseEvent";
import DiscordClient from "../client/client";
import { MessageEmbed, Role } from "discord.js";
import { getAudituser, ModLog } from "../utils/functions/mod";

export default class Event extends BaseEvent {
    constructor() {
        super("roleCreate");
    }
    async run(client: DiscordClient, role: Role) {
        var data = await getAudituser(role);
        var embed = new MessageEmbed()
            .setTitle("Role Created")
            .setColor("RANDOM")
            .addFields({ name: "Role Name:", value: `\`${role.name}\`` }, data);
        ModLog(client, role.guild.id, embed);
    }
}
