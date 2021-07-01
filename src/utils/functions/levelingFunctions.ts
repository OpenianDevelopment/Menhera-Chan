import { Message, MessageEmbed, Snowflake, TextChannel } from "discord.js";

import DiscordClient from "../../client/client";

export async function sendLevelUpMessage(
    client: DiscordClient,
    message: Message,
    level: number
) {
    if (!message.guild) return;
    const embed = new MessageEmbed()
        .setColor("#554b58")
        .setTitle(message.member?.displayName || message.author.username)
        .addField("**Congrats**", `You are now level **${level}**`)
        .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
        .setFooter(message.guild?.name || "");

    const GuildXP = client.guildXP.get(message.guild?.id);
    if (!GuildXP) return;
    if (!GuildXP.log) {
        await message.channel.send({
            content: `<@${message.author.id}>`,
            embeds: [embed],
        });
    } else {
        const channel = client.channels.cache.get(
            GuildXP.log as Snowflake
        ) as TextChannel;
        if (!channel) {
            await message.channel.send({
                content: `<@${message.author.id}>`,
                embeds: [embed],
            });
        } else {
            await channel.send({
                content: `<@${message.author.id}>`,
                embeds: [embed],
            });
        }
    }
}
