import { Message, MessageEmbed, Snowflake } from "discord.js";
import DiscordClient from "../../client/client";
import { getWarnings } from "../../database/functions/modOperation";
import { BaseCommand } from "../../utils/structures";
export default class WarnCommand extends BaseCommand {
    constructor() {
        super(
            "warnings",
            "Fetch warnings of a user",
            "moderation",
            [],
            "warnings <user>",
            "warnings [851061597853057046]"
        );
    }

    async run(client: DiscordClient, message: Message, args: Array<string>) {
        if (!message.member?.permissions.has("MANAGE_MESSAGES")) return;
        if (!args.length) {
            const embed = new MessageEmbed()
                .setColor("RED")
                .setDescription("❌ You have to provide me with a user to ban");
            message.reply({ embeds: [embed] });
            return;
        }
        const member =
            message.mentions.users.first() ||
            (await client.users.fetch(args[0] as Snowflake).catch((err) => {
                if (err) return null;
            }));

        if (!member) {
            const embed = new MessageEmbed()
                .setColor("RED")
                .setDescription("❌ I can't find this user");
            message.reply({ embeds: [embed] });
            return;
        }
        const warnings = await getWarnings(member.id, message.guild?.id);
        if (!warnings.length) {
            const embed = new MessageEmbed()
                .setAuthor(
                    `${warnings.length} warnings logged for ${member.tag}`,
                    member.displayAvatarURL({ dynamic: true })
                )
                .setColor("#554b58")
                .setTimestamp()
                .setFooter(member.id);
            message.reply({ embeds: [embed] });
            return;
        }
        let string = "";
        for (const warn of warnings) {
            if (string.length > 1500) {
                const embed = new MessageEmbed()
                    .setAuthor(
                        `${warnings.length} warnings logged for ${member.tag}`,
                        member.displayAvatarURL({ dynamic: true })
                    )
                    .setDescription(string)
                    .setColor("#554b58")
                    .setTimestamp()
                    .setFooter(member.id);
                message.reply({ embeds: [embed] });
                string = "";
            }
            if (warn.mod.includes("#")) {
                string += `**${warn._id.toHexString()} | Moderator: ${
                    warn.mod
                }**\n${warn.warn} - ${warn.date}\n\n`;
            } else {
                const mod = await client.users.fetch(warn.mod as Snowflake);
                string += `**${warn._id.toHexString()} | Moderator: ${
                    mod.tag
                }**\n${warn.warn} - ${warn.date}\n\n`;
            }
        }
        const embed = new MessageEmbed()
            .setAuthor(
                `${warnings.length} warnings logged for ${member.tag}`,
                member.displayAvatarURL({ dynamic: true })
            )
            .setDescription(string)
            .setColor("#554b58")
            .setTimestamp()
            .setFooter(member.id);
        message.reply({ embeds: [embed] });
    }
}
