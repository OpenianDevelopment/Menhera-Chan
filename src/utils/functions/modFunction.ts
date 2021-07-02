import {
    Message,
    MessageEmbed,
    Snowflake,
    TextChannel,
    User,
    UserResolvable,
} from "discord.js";
import DiscordClient from "../../client/client";

export async function sendModLogs(
    client: DiscordClient,
    title: string,
    author: User,
    user: User,
    reason: string,
    guildId: string,
    time?: number
) {
    const embed = new MessageEmbed()
        .setColor("#554b58")
        .setAuthor(
            `${title} | ${user.tag}`,
            user.displayAvatarURL({ dynamic: true })
        )
        .addField("User:", `${user as UserResolvable}`, true)
        .addField("Moderator:", `${author as UserResolvable}`, true)
        .setTimestamp()
        .setFooter(user.id);

    if (reason) {
        embed.addField("Reason", reason, true);
    }
    if (time) {
        embed.addField(
            "Time:",
            new Date(time).toISOString().substr(11, 8),
            true
        );
    }
    await sendlog(client, guildId, embed);
}
export async function sendCommandLog(
    client: DiscordClient,
    message: Message,
    command: string
) {
    const embed = new MessageEmbed()
        .setColor("#554b58")
        .setAuthor(message.author.tag, message.author.displayAvatarURL())
        .setDescription(
            `${message.author} used ${command} in ${message.channel}\n**Content:** ${message.content}`
        );
    await sendlog(client, message.guild!.id, embed);
}
export async function sendlog(
    client: DiscordClient,
    guild: string,
    embed: MessageEmbed
) {
    const { logchannel } = client.guildConfig.get(guild);
    if (!logchannel) return;
    const channel = client.channels.cache.get(
        logchannel as Snowflake
    ) as TextChannel;
    await channel.send({ embeds: [embed] });
}

export async function getMember(message: Message, userQuery: string) {
    return (
        message.mentions.members?.first() ||
        (await message.guild?.members
            .fetch(
                isNaN(parseInt(userQuery))
                    ? { user: message, query: userQuery, limit: 1 }
                    : (userQuery as Snowflake)
            )
            .catch(() => {
                return null;
            }))
    );
}
