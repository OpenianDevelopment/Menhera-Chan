import { Message, MessageEmbed, Snowflake } from "discord.js";
import DiscordClient from "../../client/client";
import { addWarning } from "../../database/functions/modOperation";
import { sendModLogs } from "../../utils/functions/modFunction";
import { BaseCommand } from "../../utils/structures";
export default class WarnCommand extends BaseCommand {
    constructor() {
        super(
            "warn",
            "warn a user",
            "moderation",
            [],
            "warn <user> <Reason>",
            "warn 851061597853057046 Rule Breaker"
        );
    }

    async run(client: DiscordClient, message: Message, args: Array<string>) {
        if (!message.member?.permissions.has("MANAGE_MESSAGES")) return;
        if (args.length !== 2) {
            const embed = new MessageEmbed()
                .setColor("RED")
                .setDescription(
                    "❌ Please provide a user to warn with reason for the warn"
                );
            message.reply({ embeds: [embed] });
            return;
        }
        const member =
            message.mentions.members?.first() ||
            (await message.guild?.members
                .fetch(
                    isNaN(parseInt(args[0]))
                        ? { user: message, query: args[0], limit: 1 }
                        : (args[0] as Snowflake)
                )
                .catch((err) => {
                    return null;
                }));
        if (!member) {
            const embed = new MessageEmbed()
                .setColor("RED")
                .setDescription("❌ I can't find this user");
            message.reply({ embeds: [embed] });
            return;
        }
        const reason = args.slice(1).join(" ");
        if (reason.length > 500) {
            const embed = new MessageEmbed()
                .setColor("RED")
                .setDescription(
                    "❌ Warning reason should not be more than 500 letters"
                );
            message.reply({ embeds: [embed] });
            return;
        }
        addWarning(
            member.user.id,
            reason,
            message.author.tag,
            message.guild!.id
        );
        const embed = new MessageEmbed()
            .setColor("#554b58")
            .setDescription(`**${member.user.tag} warned**`);
        message.reply({ embeds: [embed] });
        sendModLogs(
            client,
            "Warn",
            message.author,
            member.user,
            reason,
            message.guild!.id
        );
        member
            .send(`You have warned on ${message.guild!.name} Reason:${reason}`)
            .catch((err) => {
                message.channel.send("❌ Can't dm the user. Warning Logged");
            });
    }
}
