import BaseEvent from "../structures/BaseEvent";
import DiscordClient from "../client/client";
import { GuildEmoji } from "discord.js";

export default class Event extends BaseEvent {
    constructor() {
        super("emojiUpdate");
    }
    async run(
        client: DiscordClient,
        oldEmoji: GuildEmoji,
        newEmoji: GuildEmoji
    ) {}
}
