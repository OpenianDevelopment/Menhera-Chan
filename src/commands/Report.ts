import BaseCommand from "../structures/BaseCommand";
import DiscordClient from "../client/client";
import {
    CommandInteraction,
    Message,
    MessageEmbed,
    Util,
    WebhookClient,
} from "discord.js";
import { capFirstLetter, clean } from "../utils/functions/Custom";

export default class ReportCommand extends BaseCommand {
    constructor() {
        super("report", "Report a bug/user");
    }
    async run(client: DiscordClient, interaction: CommandInteraction) {
        try {
            const webhook = new WebhookClient({ url: process.env.REPORT_WH! });
            const wm = await interaction.followUp({
                content:
                    "You will get blacklisted if it's not a serious report",
            });
            const author = interaction.user;
            const embed = new MessageEmbed()
                .setTitle("New Report")
                .setFields({
                    name: "Author",
                    value: `${author.tag} | ${author.id}`,
                })
                .setDescription(
                    clean(interaction.options.getString("description", true))
                )
                .setTimestamp();

            await webhook
                .send({
                    content: `${interaction.guild?.name} | ${interaction.guild?.id}`,
                    embeds: [embed],
                })
                .then((e) =>
                    (wm as Message).edit({ content: `Thanks for Reporting.` })
                );
        } catch {
            console.error;
            interaction.followUp({
                content: "An error has occurred while reporing.",
            });
        }
    }
}
