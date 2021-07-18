import { Message } from "discord.js";
import DiscordClient from "../../client/client";
import { BaseCommand } from "../../utils/structures";

export default class PinCommand extends BaseCommand {
    constructor() {
        super("pin", "To pin the last message", "general", [], "pin", "pin");
    }
    async run(client: DiscordClient, message: Message, args: Array<string>) {
        await message.delete();
        message.channel.messages.fetch({ limit: 1 }).then((msg) => {
            const msg1 = msg.first();
            msg1!.pin();
        });
    }
}
