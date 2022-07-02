import CommandInt from "../../structures/BaseCommand";
import DiscordClient from "../../client/client";

import { CommandInteraction } from "discord.js";
import config from "../../utils/config";
import { CustomEmbed } from "../../utils/functions/Custom";

const EconList: CommandInt = {
    name: "econ list",
    description: "List of wiafu/husbando",
    async run(
        client: DiscordClient,
        interaction: CommandInteraction<"cached">
    ) {
        if (!client.guildSettings.get(interaction.guildId)?.misc.econ) {
            interaction.followUp({
                content: "This command is disabled in this server",
            });
            return;
        }
        const embed = new CustomEmbed(interaction, false)
            .setTitle(`Waifu/Husbando List`)
            .setDescription(
                `[Click Here](${config.links.website}/characters/)`
            );
        interaction.followUp({
            embeds: [embed],
        });
    },
};

export default EconList;
