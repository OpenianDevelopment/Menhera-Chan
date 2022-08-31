import CommandInt from "../../structures/BaseCommand";
import DiscordClient from "../../client/client";
import {
    buyWaifu,
    getBalance,
    getUserWaifus,
    getWaifuByID,
    removeBalance,
} from "../../database/functions/EconFunctions";
import { CommandInteraction } from "discord.js";

const EconBuy: CommandInt = {
    name: "econ buy",
    description: "To buy a charcters",
    async run(
        client: DiscordClient,
        interaction: CommandInteraction<"cached">
    ) {
        if (!client.guildSettings.get(interaction.guildId)?.misc.econ) {
            interaction.reply({
                content: "This command is disabled in this server",
                ephemeral: true
            });
            return;
        }
        let ID = interaction.options.getInteger("id", true);
        if (ID < 0) {
            interaction.reply({
                content: "Invalid ID",
                ephemeral: true
            });
            return;
        }
        const user = interaction.user.id!;
        const waifu = await getUserWaifus(user);
        if (waifu.find((x) => x.characterId == ID.toString())) {
            interaction.reply({
                content: `You already have Waifu ID: **${ID}**`,
                ephemeral: true,
            });
            return;
        }
        const waifuData = await getWaifuByID(ID.toString());
        if (waifuData == null) {
            interaction.reply({
                content: "Invalid ID",
                ephemeral: true
            });
            return;
        }
        const bal = await getBalance(user);
        if (bal < parseInt(waifuData.cost)) {
            interaction.reply({
                content: `You don't have enought to purchase ${
                    waifuData.name
                }\nyou need ${parseInt(waifuData.cost) - bal}`,
                ephemeral: true
            });
            return;
        }
        removeBalance(user, parseInt(waifuData.cost));
        buyWaifu(user, waifuData.id.toString());
        interaction.reply({
            content: `**${waifuData.name}** was Bought for **${waifuData.cost}**`,
        });
        return;
    },
};

export default EconBuy;
