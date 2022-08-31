import { CommandInteraction } from "discord.js";
import DiscordClient from "../../client/client";
import {
    addBalance,
    getUserWaifus,
    getWaifuByID,
    sellWaifu,
} from "../../database/functions/EconFunctions";
import CommandInt from "../../structures/BaseCommand";

const EconSell: CommandInt = {
    name: "econ sell",
    description: "Sell Waifu",
    async run(
        client: DiscordClient,
        interaction: CommandInteraction<"cached">
    ) {
        if (!client.guildSettings.get(interaction.guildId)?.misc.econ) {
            interaction.reply({
                content: "This command is disabled in this server",
                ephemeral: true,
            });
            return;
        }
        let ID = interaction.options.getInteger("id", true);
        if (ID < 0) {
            interaction.reply({
                content: "Invalid ID",
                ephemeral: true,
            });
            return;
        }
        const user = interaction.user.id!;
        const waifu = await getUserWaifus(user);
        if (!waifu.find((x: any) => x.characterId == ID.toString())) {
            interaction.reply({
                content: `You don't have Waifu ID: **${ID}**`,
                ephemeral: true,
            });
            return;
        }
        const waifuData: any = await getWaifuByID(ID.toString());
        addBalance(user, parseInt(waifuData.cost));
        sellWaifu(user, ID.toString());
        interaction.reply({
            content: `**${waifuData.name}** was Sold for **${waifuData.cost}**`,
        });
    },
};

export default EconSell;
