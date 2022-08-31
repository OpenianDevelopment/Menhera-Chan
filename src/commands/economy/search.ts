import CommandInt from "../../structures/BaseCommand";
import DiscordClient from "../../client/client";
import { embedMaker } from "../../utils/functions/embed";
import { getWaifu } from "../../database/functions/EconFunctions";

import { CommandInteraction, MessageEmbed } from "discord.js";
import { CustomEmbed } from "../../utils/functions/Custom";

const EconSearch: CommandInt = {
    name: "econ search",
    description: "Search for Waifu",
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
        let name = interaction.options.getString("name", true);
        const data = await getWaifu(name);
        const embeds: MessageEmbed[] = [];
        if (data.length < 1) {
            interaction.reply({
                content: "Not Found",
                ephemeral: true
            });
            return;
        }
        data.forEach((element) => {
            const embed = new CustomEmbed(interaction, false)
                .setTitle(`Name: ${element.name}`)
                .setDescription(
                    `**ID**: ${element.id}\n**Price**: ${element.cost}\n**Anime**: ${element.anime}`
                )
                .setImage(element.image);
            embeds.push(embed);
        });
        await embedMaker(interaction, embeds, 0);
    },
};

export default EconSearch;