import BaseCommand from "../../structures/BaseCommand";
import DiscordClient from "../../client/client";
import {
    buyWaifu,
    getBalance,
    getUserWaifus,
    getWaifuByID,
    removeBalance,
    updateBalance,
} from "../../database/functions/EconFunctions";
import { CommandInteraction } from "discord.js";

export default class EconBalanceCommand extends BaseCommand {
    constructor() {
        super("econ buy", "To buy a charcters");
    }
    async run(client: DiscordClient, interaction: CommandInteraction) {
        let ID = interaction.options.getInteger("id", true);
        if (ID < 0) {
            interaction.followUp({
                content: "Invalid ID",
            });
            return;
        }
        const user = interaction.member?.user.id!;
        const waifu = await getUserWaifus(user);
        if (waifu.find((x) => x.characterId == ID.toString())) {
            interaction.followUp({
                content: `You already have Waifu ID: **${ID}**`,
                ephemeral: true,
            });
            return;
        }
        const waifuData = await getWaifuByID(ID.toString());
        if (waifuData == null) {
            interaction.followUp({
                content: "Invalid ID",
            });
            return;
        }
        const bal = await getBalance(user);
        if (bal < parseInt(waifuData.cost)) {
            interaction.followUp({
                content: `You don't have enought to purchase ${
                    waifuData.name
                }\nyou need ${parseInt(waifuData.cost) - bal}`,
            });
        }
        removeBalance(user, parseInt(waifuData.cost));
        buyWaifu(user, waifuData.id.toString());
        interaction.followUp({
            content: `**${waifuData.name}** was Bought for **${waifuData.cost}**`,
        });
    }
}
