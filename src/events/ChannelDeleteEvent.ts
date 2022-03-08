import BaseEvent from "../structures/BaseEvent";
import DiscordClient from "../client/client";
import { GuildChannel, MessageEmbed } from "discord.js";
import { ModLog } from "../utils/functions/mod";

export default class Event extends BaseEvent {
    constructor() {
        super("channelDelete");
    }
    async run(client: DiscordClient, channel: GuildChannel) {
        var embed = new MessageEmbed()
            .setTitle("Channel Deleted")
            .setColor("RANDOM")
            .addFields(
                { name: "Channel Name:", value: `\`${channel.name}\`` },
                { name: "Channel ID:", value: `\`${channel.id}\`` }
            );
        ModLog(client, channel.guildId, embed);
    }
}
