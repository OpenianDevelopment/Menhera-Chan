import BaseCommand from "../../structures/BaseCommand";
import DiscordClient from "../../client/client";

import { CommandInteraction, MessageEmbed } from "discord.js";
import config from "../../utils/config";

export default class EconBalanceCommand extends BaseCommand {
    constructor() {
        super("econ list", "List of wiafu/husbando");
    }
    async run(client: DiscordClient, interaction: CommandInteraction) {
        const embed = new MessageEmbed()
            .setTitle(`Waifu/Husbando List`)
            .setDescription(
                `[Click Here](${config.links.website}/characters/)`
            );
        interaction.followUp({
            embeds: [embed],
        });
    }
}
