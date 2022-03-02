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
            const type = interaction.options.getSubcommand(true);
            const author = interaction.user;
            const embed = new MessageEmbed()
                .setTitle("Report Type: " + capFirstLetter(type))
                .setFields({
                    name: "Author",
                    value: `${author.tag} | ${author.id}`,
                })
                .setTimestamp();
            if (type == "user") {
                const user = interaction.options.getUser("target", true);
                const reason = interaction.options.getString("reason", true);
                embed.addFields(
                    { name: "Target", value: `${user.tag} | ${user.id}` },
                    { name: "Reason", value: clean(reason) }
                );
            } else {
                embed.setDescription(
                    clean(interaction.options.getString("description", true))
                );
            }
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
                content: "An error has occued while reporing.",
            });
        }
    }
}
