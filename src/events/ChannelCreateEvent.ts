import BaseEvent from "../structures/BaseEvent";
import DiscordClient from "../client/client";
import { GuildChannel, MessageEmbed, TextChannel } from "discord.js";
import { getAudituser, ModLog } from "../utils/functions/mod";

export default class Event extends BaseEvent {
    constructor() {
        super("channelCreate");
    }
    async run(client: DiscordClient,channel:GuildChannel) {
        var data = await getAudituser(channel)
        var embed = new MessageEmbed()
        .setTitle("Channel Created")
        .setColor("RANDOM")
        .addFields({name:"Channel Name:",value:`\`${channel.name}\``},{name:"Channel ID:",value:`\`${channel.id}\``},data)
        ModLog(client,channel.guildId,embed)
    }
}