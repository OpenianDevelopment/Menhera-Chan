import BaseCommand from "../../structures/BaseCommand";
import DiscordClient from "../../client/client";
import { CommandInteraction, GuildMember } from "discord.js";
import config from "../../utils/config";
import { CustomEmbed } from "../../utils/functions/Custom";

export default class CmdCommand extends BaseCommand {
    constructor() {
        super("command", "Search for a command");
    }
    async run(client: DiscordClient, interaction: CommandInteraction) {
        const query = interaction.options.getString("query", true);
        if (query.length <= 4) {
            await interaction.followUp({
                content: `${config.emojis.redCrossMark} \`query\` has to be 3+ characters`,
            });
            return;
        }
        const cmds = client.commands
            .filter(
                (c) => c.name.includes(query) || c.description.includes(query)
            )
            .map((command) => `**${command.name}** ~ ${command.description}.`)
            .join("\n");
        const embed = new CustomEmbed(interaction, true, false)
            .setDescription(
                cmds.length > 2000 ? cmds.substring(0, 2000) + "..." : cmds
            )
            .setTimestamp();
        await interaction.followUp({ embeds: [embed] });
        return;
    }
}
