import BaseEvent from "../structures/BaseEvent";
import DiscordClient from "../client/client";
import { MessageEmbed, TextBasedChannel } from "discord.js";
import { getAudituser, ModLog } from "../utils/functions/mod";

export default class Event extends BaseEvent {
    constructor() {
        super("channelPinsUpdate");
    }
    async run(client: DiscordClient,channel:TextBasedChannel, time:Date) {
        //need to figure out how to code this
    }
}