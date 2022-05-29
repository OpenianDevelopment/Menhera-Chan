import BaseInt from "../../structures/BaseCommand";
import DiscordClient from "../../client/client";
import { CommandInteraction } from "discord.js";
import { CustomEmbed } from "../../utils/functions/Custom";

export default class FlipCommand extends BaseInt {
    constructor() {
        super("flip", "Flips a coin");
    }
    async run(client: DiscordClient, interaction: CommandInteraction) {
        let num: number | string = Math.floor(Math.random() * 3);
        if (num > 1) {
            num = "head";
        } else {
            num = "tails";
        }
        const embed = new CustomEmbed(interaction, false)
            .setTitle("Coin Flip")
            .setThumbnail(
                `https://cdn.discordapp.com/attachments/715192953957515346/731653756109979648/5291f56897d748b1ca0a10c90023588d.gif`
            )
            .setDescription(`You flpped a coin`)
            .addField(`It landed on:`, `${num}`);

        interaction.followUp({
            embeds: [embed],
        });
    }
}
