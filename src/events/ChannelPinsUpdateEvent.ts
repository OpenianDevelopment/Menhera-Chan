import BaseEvent from "../structures/BaseEvent";
import DiscordClient from "../client/client";
import { TextBasedChannel } from "discord.js";

export default class Event extends BaseEvent {
    constructor() {
        super("channelPinsUpdate");
    }
    async run(client: DiscordClient,channel:TextBasedChannel, time:Date) {
        
    }
}