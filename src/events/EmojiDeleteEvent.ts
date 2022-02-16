import BaseEvent from "../structures/BaseEvent";
import DiscordClient from "../client/client";
import { GuildEmoji, MessageEmbed } from "discord.js";
import { getAudituser, ModLog } from "../utils/functions/mod";

export default class Event extends BaseEvent {
    constructor() {
        super("emojiDelete");
    }
    async run(client: DiscordClient,emoji:GuildEmoji) {
        //idk if this works ¯\_(ツ)_/¯
        var data = await getAudituser(emoji)
        var embed = new MessageEmbed()
        .setTitle("Emoji Deleted")
        .setColor("RANDOM")
        .setThumbnail(emoji.url)
        .addFields({name:"Emoji Name:",value:`\`${emoji.name}\``},data)
        ModLog(client,emoji.guild.id,embed)
    }
}