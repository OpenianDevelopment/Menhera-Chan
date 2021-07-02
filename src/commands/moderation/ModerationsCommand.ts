import { Message, MessageEmbed, Snowflake } from "discord.js";
import DiscordClient from "../../client/client";
import { getModerations } from "../../database/functions/modOperation";
import { BaseCommand } from "../../utils/structures";
import { moderation } from "../../utils/interfaces/moderationInterfaces";
import ms from "ms";
export default class ModerationsCommand extends BaseCommand {
    constructor() {
        super(
            "moderations",
            "Get the list of active moderations",
            "moderation",
            ["mod"],
            "moderation",
            "moderation"
        );
    }
    async run(client: DiscordClient, message: Message, args: Array<string>) {
        if (!message.member?.permissions.has("MANAGE_MESSAGES")) return;
        const moderationsData = await getModerations(message.guild?.id);
        const moderations: [moderation] = moderationsData.moderations;

        if (!moderations.length) {
            const embed = new MessageEmbed()
                .setColor("#554b58")
                .setTitle(`${moderations.length} Moderations`)
                .setTimestamp();
            await message.channel.send({ embeds: [embed] });
            return;
        }
        let string = "";
        for (const moderation of moderations) {
            if (string.length > 1500) {
                const embed = new MessageEmbed()
                    .setColor("#554b58")
                    .setTitle(`${moderations.length} Moderations`)
                    .setDescription(string)
                    .setTimestamp();
                await message.channel.send({ embeds: [embed] });
                string = "";
            }
            const time = ms(moderation.time - Date.now());
            if (moderation.username?.includes("#")) {
                string += `${moderation.modtype} **|** ${moderation.username} **|** Remaining: ${time}\n`;
            } else {
                const member = await client.users.fetch(
                    moderation.user as Snowflake
                );
                string += `${moderation.modtype} **|** ${member.username} **|** Remaining ${time}\n`;
            }
        }

        const embed = new MessageEmbed()
            .setColor("#554b58")
            .setTitle(`${moderations.length} Moderations`)
            .setTimestamp();
        if (string.length > 0) {
            embed.setDescription(string);
        }
        await message.channel.send({ embeds: [embed] });
    }
}
