import { Message, MessageEmbed, Snowflake } from "discord.js";
import DiscordClient from "../../client/client";
import { sendModLogs } from "../../utils/functions/modFunction";
import { BaseCommand } from "../../utils/structures";
export default class UnmuteCommand extends BaseCommand {
    constructor() {
        super(
            "unmute",
            "Unmute a muted user",
            "moderation",
            [],
            "unmute <user> [Reason]",
            "unmute Nabe#0001 CoolDude69"
        );
    }

    async run(client: DiscordClient, message: Message, args: Array<string>) {
        if (!message.member?.permissions.has("MANAGE_MESSAGES")) return;
        if (!message.guild?.me?.permissions.has("MANAGE_MESSAGES")) {
            const embed = new MessageEmbed()
                .setColor("RED")
                .setDescription("❌ I don't have `Manage Messages` Permission");
            await message.reply({ embeds: [embed] });
            return;
        }
        if (!args.length) {
            const embed = new MessageEmbed()
                .setColor("RED")
                .setDescription("❌ Please provide a user to kick");
            await message.reply({ embeds: [embed] });
            return;
        }
        const member =
            message.mentions.members?.first() ||
            (await message.guild?.members
                .fetch(
                    isNaN(Number(args[0]))
                        ? { user: message, query: args[0], limit: 1 }
                        : (args[0] as Snowflake)
                )
                .catch(() => {
                    return null;
                }));
        if (!member) {
            const embed = new MessageEmbed()
                .setColor("RED")
                .setDescription("❌ I can't find this user");
            await message.reply({ embeds: [embed] });
            return;
        }
        const { muterole } = client.guildConfig.get(message.guild?.id);
        if (
            !muterole ||
            !message.guild.roles.cache.has(muterole as Snowflake)
        ) {
            const embed = new MessageEmbed()
                .setColor("RED")
                .setDescription(
                    "❌ Mute Role has been not setup for this server. Please visit [Dashboard](https://dashboard.menhera-chan.in/) to set it up"
                );
            await message.reply({ embeds: [embed] });
            return;
        }
        if (!member.roles.cache.has(muterole)) {
            const embed = new MessageEmbed()
                .setColor("RED")
                .setDescription(`❌ ${member.user.username} is not muted`);
            await message.reply({ embeds: [embed] });
            return;
        }
        const reason = args.slice(1).join(" ") || "No Reason Provided";
        member.roles.remove(muterole as Snowflake, reason).catch(() => {
            const embed = new MessageEmbed()
                .setColor("RED")
                .setDescription(
                    "❌ I am not able to unmute. Make sure my role is higher than Mute Role"
                );
            message.reply({ embeds: [embed] });
            return;
        });
        await sendModLogs(
            client,
            "Unmute",
            message.author,
            member.user,
            reason,
            message.guild!.id
        );
        const embed = new MessageEmbed()
            .setColor("#554b58")
            .setDescription(`**${member.user.username} Unmuted**`);
        await message.reply({ embeds: [embed] });
    }
}
