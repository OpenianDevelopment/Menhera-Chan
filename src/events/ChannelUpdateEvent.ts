import BaseEvent from "../structures/BaseEvent";
import DiscordClient from "../client/client";
import { GuildChannel, MessageEmbed } from "discord.js";
import { channel } from "diagnostics_channel";

export default class Event extends BaseEvent {
    constructor() {
        super("channelUpdate");
    }
    async run(client: DiscordClient,oldChannel:GuildChannel,newChannel:GuildChannel) {
        //implemnet later
    }
}