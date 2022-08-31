import BaseEvent from "../structures/BaseEvent";
import DiscordClient from "../client/client";
import chalk from "chalk";
import { cacheGuildSettings } from "../utils/initialFunctions";
import Socket from "../utils/socket";

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
        //! WebSocket Is Not Finished Yet
        //Socket(client, 4200);
        setInterval(() => {
            client.user!.setActivity({
                name: `${client.guilds.cache.size} Servers`,
                type: "WATCHING",
            });
        }, 10 * 60 * 1000); //every 10 mins
    }
}
