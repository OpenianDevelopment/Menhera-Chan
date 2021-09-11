import BaseEvent from "../structures/BaseEvent";
import DiscordClient from "../client/client";
import chalk from "chalk";

export default class ReadyEvent extends BaseEvent {
    constructor() {
        super("ready");
    }
    async run(client: DiscordClient) {
        console.log(`${client.user!.tag} is ${chalk.bgGreen("online")}`);
    }
}
