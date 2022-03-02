import BaseEvent from "../structures/BaseEvent";
import DiscordClient from "../client/client";
import { Message } from "discord.js";

export default class Event extends BaseEvent {
    constructor() {
        super("messageDelete");
    }
    async run(client: DiscordClient, message: Message) {}
}
