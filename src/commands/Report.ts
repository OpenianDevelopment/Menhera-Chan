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
            const wm = await interaction.followUp({
                content:
                    "You will get blacklisted if it's not a serious report",
            });
            const author = interaction.user;
            const desc = clean(
                interaction.options.getString("description", true)
            );
            ReportBug(desc, author, interaction.guild).then((e) =>
                (wm as Message).edit({ content: `Thanks for Reporting.` })
            );
        } catch (err) {
            console.error(err);
            interaction.followUp({
                content: "An error has occurred while reporing.",
            });
        }
    },
};

export default Report;
