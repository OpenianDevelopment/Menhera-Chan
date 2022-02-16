import BaseEvent from "../structures/BaseEvent";
import DiscordClient from "../client/client";
import { Guild } from "discord.js";

export default class Event extends BaseEvent {
    constructor() {
        super("guildUpdate");
    }
    async run(client: DiscordClient,oldGuild:Guild,newGuild:Guild) {
        //figure this out aswell
    }
}