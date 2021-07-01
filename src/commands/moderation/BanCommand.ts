import { Message, MessageEmbed, Snowflake } from "discord.js";
import DiscordClient from "../../client/client";
import { BaseCommand } from "../../utils/structures";
import { sendModLogs } from "../../utils/functions/modFunction";
export default class BanCommand extends BaseCommand {
    constructor() {
        super(
            "ban",
            "Ban a user",
            "moderation",
            [],
            "ban <user> [Reason]",
            "ban rohank05#6551 noob"
        );
    }
    async run(client: DiscordClient, message: Message, args: Array<string>) {
        if (!message.member?.permissions.has("BAN_MEMBERS")) return;
        if (!message.guild?.me?.permissions.has("BAN_MEMBERS")) {
            const embed = new MessageEmbed()
                .setColor("RED")
                .setDescription("❌ I don't have `Ban` Permission");
            await message.reply({ embeds: [embed] });
            return;
        }
        if (!args.length) {
            const embed = new MessageEmbed()
                .setColor("RED")
                .setDescription("❌ You have to provide me with a user to ban");
            await message.reply({ embeds: [embed] });
            return;
        }
        const member =
            (await message.mentions.users.first()) ||
            (await client.users.fetch(args[0] as Snowflake).catch(() => {
                return null;
            }));

        if (!member) {
            const embed = new MessageEmbed()
                .setColor("RED")
                .setDescription("❌ I can't find this user");
            await message.reply({ embeds: [embed] });
            return;
        }

        const GuildMember = await message.guild.members
            .fetch(args[0] as Snowflake)
            .catch((err) => {
                if (err) return false;
            });

        if (GuildMember && !GuildMember.bannable) {
            const embed = new MessageEmbed()
                .setColor("RED")
                .setDescription(`❌ I can't ban ${member.tag}`);
            await message.reply({ embeds: [embed] });
            return;
        }

        const embed = new MessageEmbed()
            .setColor("#554b58")
            .setDescription(`**${member.tag} banned**`);

        const reason = args.slice(1).join(" ") || "No Reason Provided";
        await message.reply({ embeds: [embed] });
        await member
            .send(
                `You have been banned from ${message.guild?.name} for reason: ${reason}`
            )
            .catch(() => {
                message.channel.send(
                    "❌ User DM seems to be closed. So i couldn't inform them the reason"
                );
            });
        message.guild?.members.ban(member.id, {
            reason: reason,
            days: 1,
        });
        sendModLogs(
            client,
            "Ban",
            message.author,
            member,
            reason,
            message.guild!.id
        );
    }
}
