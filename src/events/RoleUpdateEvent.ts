import BaseEvent from "../structures/BaseEvent";
import DiscordClient from "../client/client";
import { Role } from "discord.js";

export default class Event extends BaseEvent {
    constructor() {
        super("roleUpdate");
    }
    async run(client: DiscordClient, newRole: Role, oldRole: Role) {
        //figure this out aswell
    }
}
