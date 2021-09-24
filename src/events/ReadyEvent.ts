import BaseEvent from "../structures/BaseEvent";
import DiscordClient from "../client/client";
import chalk from "chalk";
import { cacheGuildSettings } from "../utils/initialFunctions";

export default class ReadyEvent extends BaseEvent {
    constructor() {
        super("ready");
    }
    async run(client: DiscordClient) {
        console.log(`${client.user!.tag} is ${chalk.bgGreen("online")}`);
        await cacheGuildSettings(client);
        client.user!.setActivity({
            name: `${client.guilds.cache.size} Servers`,
            type: "WATCHING",
        });
    }
}
