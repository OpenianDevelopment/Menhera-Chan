import CommandInt from "../structures/BaseCommand";
import DiscordClient from "../client/client";
import { CommandInteraction, Message } from "discord.js";
import { clean, ReportBug } from "../utils/functions/Custom";

const Report: CommandInt = {
    name: "report",
    description: "Report a bug",
    async run(
        client: DiscordClient,
        interaction: CommandInteraction<"cached">
    ) {
        try {
            const wm = await interaction.reply({
                content:
                    "You will get blacklisted if it's not a serious report",
                fetchReply: true,
            });
            const author = interaction.user;
            const desc = clean(
                interaction.options.getString("description", true)
            );
            ReportBug(desc, author, interaction.guild).then((e) =>
                setTimeout(() => {
                    wm.edit({ content: `Thanks for Reporting.` });
                }, 10 * 1000)
            );
        } catch (err) {
            console.error(err);
            interaction.reply({
                content: "An error has occurred while reporing.",
            });
        }
    },
};

export default Report;
