import { Message, MessageEmbed, TextChannel } from "discord.js";

export async function SendStarMessage(
    starChannel: TextChannel,
    starMsg: Message | null,
    reactionCount: number,
    message: Message
) {
    if (!starMsg) {
        const attachments: string[] = [];
        if (message.attachments.size >= 1) {
            for (let i = 0; i <= message.attachments.size - 1; i++) {
                attachments.push(message.attachments.at(i)!.url);
            }
        }
        const ImageEmbeds = message.embeds.filter(
            (embed) => embed.type === "image"
        );
        if (ImageEmbeds.length >= 1) {
            for (let i = 0; i <= ImageEmbeds.length - 1; i++) {
                attachments.push(ImageEmbeds[i].url!);
            }
        }
        const embed = new MessageEmbed()
            .setAuthor({
                name: message.author.tag,
                iconURL: message.author.displayAvatarURL(),
            })
            .setDescription(
                message.content.length <= 2000
                    ? message.content
                    : message.content.slice(0, 2000 - message.content.length) +
                          "..."
            )
            .setTitle("Go to source!")
            .setURL(message.url)
            .setColor("GOLD")
            .setFooter({
                text: `messageId: ${message.id}`,
            })
            .setTimestamp();
        starChannel
            .send({
                content: `**${SetStar(reactionCount)} ${reactionCount}** | <#${
                    message.channel.id
                }>`,
                embeds: [embed],
                files: attachments,
            })
            .then((m) => m.react("⭐"))
            .catch((err) => {});
    } else {
        updateStars(starMsg, reactionCount);
    }
}
export function updateStars(starMsg: Message | null, newCount: number) {
    if (!starMsg) return;
    const channelId = starMsg.content.replace(/(<|>)/g, "").split("#")[1];
    if (newCount <= 0) return starMsg.delete();
    starMsg
        .edit({
            content: `**${SetStar(newCount)} ${newCount}** | <#${channelId}>`,
        })
        .catch((err) => {});
}
function SetStar(count: number) {
    if (count >= 20) return "💫";
    if (count >= 15) return "✨";
    if (count >= 10) return "🌟";
    return "⭐";
}
