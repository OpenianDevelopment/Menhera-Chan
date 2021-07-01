import { Message, MessageEmbed, Snowflake } from "discord.js";
import DiscordClient from "../../client/client";
import { BaseCommand } from "../../utils/structures";
import { sendModLogs } from "../../utils/functions/modFunction";
import {
    getWarningsOne,
    removeWarn,
} from "../../database/functions/modOperation";
import { Types } from "mongoose";
export default class DelwarnCommand extends BaseCommand {
    constructor() {
        super(
            "delwarn",
            "Delete a member warning",
            "moderation",
            ["dw"],
            "delwarn <warning id> [Reason]",
            "delwarn 6058839407ec9b5e60aaf6b0 false warn"
        );
    }
    async run(client: DiscordClient, message: Message, args: Array<string>) {
        if (!message.member?.permissions.has("MANAGE_MESSAGES")) return;
        if (!args.length) {
            const embed = new MessageEmbed()
                .setColor("RED")
                .setDescription("❌ Please provide Warning ID");
            await message.reply({ embeds: [embed] });
            return;
        }
        if (!Types.ObjectId.isValid(args[0])) {
            const embed = new MessageEmbed()
                .setColor("RED")
                .setDescription("❌ Please provide correct warning ID");
            await message.reply({ embeds: [embed] });
            return;
        }
        const warnId = Types.ObjectId(args[0]);
        const warningInfo = await getWarningsOne(warnId, message.guild?.id);
        if (!warningInfo.length) {
            const embed = new MessageEmbed()
                .setColor("RED")
                .setDescription("❌ Provided Warning ID does not exist");
            await message.reply({ embeds: [embed] });
            return;
        }

        const delStatus = await removeWarn(warnId, message.guild?.id);
        if (!delStatus) {
            const embed = new MessageEmbed()
                .setColor("RED")
                .setDescription("❌ Something went wrong");
            await message.reply({ embeds: [embed] });
            return;
        }
        const reason = args.slice(1).join(" ") || "No Reason Provided";
        const member = await client.users
            .fetch(warningInfo[0].user as Snowflake)
            .catch(() => {
                return null;
            });
        if (!member) {
            const embed = new MessageEmbed()
                .setColor("#554b58")
                .setDescription(`**${args[0]} deleted successfully**`);
            await message.reply({ embeds: [embed] });
            return;
        }
        const embed = new MessageEmbed()
            .setColor("#554b58")
            .setDescription(
                `**${args[0]} for \`${member.tag}\` deleted successfully**`
            );
        await message.reply({ embeds: [embed] });
        sendModLogs(
            client,
            "Warnings Deleted",
            message.author,
            member,
            reason,
            message.guild!.id
        );
    }
}
