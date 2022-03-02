import BaseEvent from "../structures/BaseEvent";
import DiscordClient from "../client/client";
import { GuildChannel } from "discord.js";

export default class Event extends BaseEvent {
    constructor() {
        super("channelUpdate");
    }
    async run(
        client: DiscordClient,
        oldChannel: GuildChannel,
        newChannel: GuildChannel
    ) {}
}
