import BaseEvent from "../structures/BaseEvent";
import DiscordClient from "../client/client";
import { Role } from "discord.js";

export default class Event extends BaseEvent {
    constructor() {
        super("roleCreate");
    }
    async run(client: DiscordClient,role:Role) {
        
    }
}