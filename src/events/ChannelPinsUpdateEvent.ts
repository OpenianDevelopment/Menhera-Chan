import BaseEvent from "../structures/BaseEvent";
import DiscordClient from "../client/client";
import { TextChannel } from "discord.js";

export default class Event extends BaseEvent {
    constructor() {
        super("channelPinsUpdate");
    }
    async run(client: DiscordClient, channel: TextChannel, time: Date) {}
}
