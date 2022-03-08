import BaseCommand from "../../structures/BaseCommand";
import DiscordClient from "../../client/client";

import { CommandInteraction } from "discord.js";
import config from "../../utils/config";
import { CustomEmbed } from "../../utils/functions/Custom";

export default class EconListCommand extends BaseCommand {
    constructor() {
        super("econ list", "List of wiafu/husbando");
    }
    async run(client: DiscordClient, interaction: CommandInteraction) {
        const embed = new CustomEmbed(interaction, false)
            .setTitle(`Waifu/Husbando List`)
            .setDescription(
                `[Click Here](${config.links.website}/characters/)`
            );
        interaction.followUp({
            embeds: [embed],
        });
    }
}
