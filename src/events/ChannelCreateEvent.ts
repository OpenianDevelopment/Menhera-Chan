import BaseEvent from "../structures/BaseEvent";
import DiscordClient from "../client/client";
import { GuildChannel, TextChannel } from "discord.js";

export default class Event extends BaseEvent {
    constructor() {
        super("channelCreate");
    }
    async run(client: DiscordClient, channel: GuildChannel) {
        var guildOption = client.guildSettings.get(
            channel.guildId
        )?.moderationSettings;
        // make message here as embed

        //make this a function
        if (!guildOption?.modLogChannel) return;
        var guild = channel.guild;
        var Modchannel = (await guild.channels.fetch(
            guildOption.modLogChannel
        )) as TextChannel;
        if (!Modchannel) return;
        Modchannel.send("embed here");

        //make this a function
    }
}
