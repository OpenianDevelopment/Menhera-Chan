import BaseCommand from "../../structures/BaseCommand";
import DiscordClient from "../../client/client";
const DBL = require("dbl-api");

import { CommandInteraction } from "discord.js";

export default class EconBalanceCommand extends BaseCommand {
    constructor() {
        super("econ dailycoins", "get daility coins");
    }
    async run(client: DiscordClient, interaction: CommandInteraction) {
        var DBL_TOKEN = process.env.DBL_TOKEN;
        if (DBL_TOKEN == ("" || undefined)) {
            interaction.followUp({
                content: "Command not set up.",
            });
            return;
        }
        const dbl = new DBL(DBL_TOKEN, client);
        dbl.hasVoted(interaction.member?.user.id).then((votes: any) => {
            if (votes == false) {
                interaction.followUp({
                    content: `vote to get daily coins \nGo to https://top.gg/bot/${client.user?.id} to vote!`,
                });
            } else {
                interaction.followUp({
                    content:
                        "You already got you daily coins! \nCome back at a later time.",
                });
            }
        });
    }
}
