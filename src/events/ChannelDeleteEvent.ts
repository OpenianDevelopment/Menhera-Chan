import BaseEvent from "../structures/BaseEvent";
import DiscordClient from "../client/client";
import { GuildChannel } from "discord.js";

export default class Event extends BaseEvent {
    constructor() {
        super("channelDelete");
    }
    async run(client: DiscordClient,channel:GuildChannel) {
        var guildOption = client.guildSettings.get(channel.guildId)?.moderationSettings
        if(!guildOption?.modLogChannel)return
        var guild = channel.guild
        var Modchannel = await guild.channels.fetch(guildOption.modLogChannel) as TextChannel
        if(!Modchannel)return
        //custom message here
        Modchannel.send("message here")
    }
}