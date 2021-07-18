import { Message } from "discord.js";
import DiscordClient from "../../client/client";
import { BaseCommand } from "../../utils/structures";
import axios from "axios";

export default class InspireCommand extends BaseCommand {
    constructor() {
        super(
            "inspire",
            "random inspirational quotes",
            "general",
            [],
            "inspire",
            "inspire"
        );
    }
    async run(client: DiscordClient, message: Message, args: Array<string>) {
        await axios.get("https://www.affirmations.dev/").then((res) => {
            message.reply({ content: res.data.affirmation });
        });
    }
}
