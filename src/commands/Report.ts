import BaseCommand from "../structures/BaseCommand";
import DiscordClient from "../client/client";
import {
    CommandInteraction,
    Message,
    MessageEmbed,
    Util,
    WebhookClient,
} from "discord.js";
import { capFirstLetter, clean } from "../utils/Custom";

export default class ReportCommand extends BaseCommand {
    constructor() {
        super("report", "Report a bug/user");
    }
    async run(client: DiscordClient, interaction: CommandInteraction) {
        const webhook = new WebhookClient({ url: process.env.REPORT_WH! });
        const wm = await interaction.followUp({
            content: "You will get blacklisted if it's not a serious report",
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
        var data1, data2;
        if (type == "user") {
            data1 = interaction.options.getUser("target", true);
            data2 = interaction.options.getString("reason", true);
            embed.addFields(
                { name: "Target", value: `${data1.tag} | ${data1.id}` },
                { name: "Reason", value: clean(data2) }
            );
        } else {
            data1 = interaction.options.getString("description", true);
            embed.setDescription(clean(data1));
        }
        await webhook.send({
            content: `${interaction.guild?.name} | ${interaction.guild?.id}`,
            embeds: [embed],
        });
        Util.delayFor(10e4);
        await (wm as Message).edit({ content: `Thanks for Reporting.` });
    }
}
