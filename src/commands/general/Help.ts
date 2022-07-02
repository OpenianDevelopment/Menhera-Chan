import CommandInt from "../../structures/BaseCommand";
import DiscordClient from "../../client/client";
import { CommandInteraction } from "discord.js";
import config from "../../utils/config";
import { CustomEmbed } from "../../utils/functions/Custom";

const Help: CommandInt = {
    name: "help",
    description: "Search for a command",
    async run(client: DiscordClient, interaction: CommandInteraction) {
        const query = interaction.options.getString("query", true);
        if (query.length <= 2) {
            await interaction.followUp({
                content: `${config.emojis.redCrossMark} \`query\` has to be 3 characters or more`,
            });
            return;
        }
        const cmds = client.commands
            .filter(
                (c) =>
                    c.name.toLowerCase().includes(query) ||
                    c.description.toLowerCase().includes(query)
            )
            .map((command) => `**${command.name}** ~ ${command.description}.`)
            .join("\n");
        const embed = new CustomEmbed(interaction, true, false)
            .setDescription(
                cmds
                    ? cmds.length > 2000
                        ? cmds.substring(0, 2000) + "..."
                        : cmds
                    : "No Command Found"
            )
            .setTimestamp();
        await interaction.followUp({ embeds: [embed] });
        return;
    },
};

export default Help;