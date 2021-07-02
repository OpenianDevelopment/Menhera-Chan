import { Message, MessageEmbed, Snowflake } from "discord.js";
import DiscordClient from "../../client/client";
import { sendModLogs } from "../../utils/functions/modFunction";
import { BaseCommand } from "../../utils/structures";
export default class UnbanCommand extends BaseCommand {
    constructor() {
        super(
            "unban",
            "Unban a Banned user",
            "moderation",
            [],
            "unban <user_id> [Reason]",
            "unban 851061597853057046 Rule Breaker"
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
                .setDescription("❌ Please provide the id of the user");
            await message.reply({ embeds: [embed] });
        }

        const bannedMember = await message.guild?.bans
            .fetch({
                user: args[0] as Snowflake,
                cache: false,
            })
            .catch(() => {
                const embed = new MessageEmbed()
                    .setColor("RED")
                    .setDescription(
                        "❌ I am not able to this user in Banlist. Make sure the provided ID is correct"
                    );
                message.reply({ embeds: [embed] });
                return;
            });

        if (!bannedMember) {
            const embed = new MessageEmbed()
                .setColor("RED")
                .setDescription(
                    "❌ I am not able to this user in Banlist. Make sure the provided ID is correct"
                );
            await message.reply({ embeds: [embed] });
            return;
        }
        const reason = args.slice(1).join(" ") || "No Reason Provided";
        await message.guild.members.unban(bannedMember.user.id, reason);
        const embed = new MessageEmbed()
            .setColor("#554b58")
            .setDescription(`**${bannedMember.user.username} Unbanned**`);
        await message.reply({ embeds: [embed] });
        await sendModLogs(
            client,
            "Unban",
            message.author,
            bannedMember.user,
            reason,
            message.guild!.id
        );
    }
}
