import BaseCommand from "../../structures/BaseCommand";
import DiscordClient from "../../client/client";
import {
    addBalance,
    getBalance,
    getWaifuByID,
} from "../../database/functions/EconFunctions";

import { CommandInteraction } from "discord.js";

let ResponsesArray: Array<string> = [
    "I don't have my credit card now",
    "Uhh i don't have money but you're cute *huggies*",
    "Well no",
    "Try someone else cutie",
    "*walks away*",
    "Can i give you something else owo",
    "Hmm let me think *runs away*",
    "Nonononononononono",
    "Sorry sweety",
];

export default class EconBalanceCommand extends BaseCommand {
    constructor() {
        super("econ beg", "Beg for money");
    }
    async run(client: DiscordClient, interaction: CommandInteraction) {
        let user: any = interaction.member?.user.id;
        let character: any = await getWaifuByID(
            (Math.floor(Math.random() * 43527) + 1).toString()
        );
        if (character == null || undefined) {
            character = {};
            character.name = "Random";
        }
        var math = Math.floor(Math.random() * (ResponsesArray.length + 4));
        if (math > ResponsesArray.length) {
            let TheCoins = Math.floor(Math.random() * 150) + 2;
            addBalance(user, TheCoins);
            interaction.followUp({
                content: `**${character.name}** gave you ${TheCoins} coins! Remember to say thanks!`,
            });
            return;
        }
        interaction.followUp({
            content: `**${character.name}**: ${ResponsesArray[math]}`,
        });
    }
}
