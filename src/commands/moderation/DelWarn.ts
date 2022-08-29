import CommandInt from "../../structures/BaseCommand";
import DiscordClient from "../../client/client";
import { CheckPermsBoth } from "../../utils/functions/mod";
import { CommandInteraction, MessageEmbed } from "discord.js";
import config from "../../utils/config";
import { removeWarn } from "../../database/functions/WarnsFunctions";

const ModDeleteWarn: CommandInt = {
    name: "mod delwarn",
    description: "Deletes a warn by id",
    async run(
        client: DiscordClient,
        interaction: CommandInteraction<"cached">
    ) {
        if (!(await CheckPermsBoth(interaction, "MANAGE_MESSAGES"))) {
            return;
        }
        const id = interaction.options.getString("warn-id", true);
        const result = await removeWarn(interaction.guild.id, id);
        if (!result) {
            await interaction.reply({
                content: `${config.emojis.redCrossMark} Warn id doesn't exist!`,
                ephemeral: true
            });
            return;
        }
        try {
            await interaction.reply({
                embeds: [
                    new MessageEmbed().setDescription(
                        `${config.emojis.whiteHeavyCheckMark} Warn id **${id}** was deleted`
                    ),
                ],
            });
            return;
        } catch {
            await interaction.reply({
                content: `${config.emojis.redCrossMark} Command errored out`,
                ephemeral: true
            });
            return;
        }
    },
};

export default ModDeleteWarn;
