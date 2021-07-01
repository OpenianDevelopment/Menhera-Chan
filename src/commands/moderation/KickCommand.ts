import { Message, MessageEmbed, Snowflake } from "discord.js";
import DiscordClient from "../../client/client";
import { BaseCommand } from "../../utils/structures";
import { sendModLogs } from "../../utils/functions/modFunction";
export default class KickCommand extends BaseCommand {
    constructor() {
        super(
            "kick",
            "Kick a member",
            "moderation",
            [],
            "kick <user> [Reason]",
            "kick Julio_#7057 Raiding"
        );
    }
    async run(client: DiscordClient, message: Message, args: Array<string>) {
        if (!message.member?.permissions.has("KICK_MEMBERS")) return;
        if (!message.guild?.me?.permissions.has("KICK_MEMBERS")) {
            const embed = new MessageEmbed()
                .setColor("RED")
                .setDescription("❌ I don't have `Kick` Permission");
            message.reply({ embeds: [embed] });
            return;
        }
        if (!args.length) {
            const embed = new MessageEmbed()
                .setColor("RED")
                .setDescription("❌ Please provide a user to kick");
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
        if (!member.kickable) {
            const embed = new MessageEmbed()
                .setColor("RED")
                .setDescription("❌ I am not able to kick this user");
            message.reply({ embeds: [embed] });
            return;
        }
        const embed = new MessageEmbed()
            .setColor("#554b58")
            .setDescription(`**${member.user.username} kicked**`);
        message.reply({ embeds: [embed] });

        const reason = args.slice(1).join(" ") || "No Reason Provided";
        await member
            .send(
                `You have been kick from ${message.guild?.name} for Reason: ${reason}`
            )
            .catch(() => {
                message.channel.send(
                    "❌ User DM seems to be closed. So i couldn't inform them the reason"
                );
            });
        member.kick(reason);

        sendModLogs(
            client,
            "Kick",
            message.author,
            member.user,
            reason,
            message.guild!.id
        );
    }
}
