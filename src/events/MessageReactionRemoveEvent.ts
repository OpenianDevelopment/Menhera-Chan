import BaseEvent from "../structures/BaseEvent";
import DiscordClient from "../client/client";
import { Message, MessageReaction, TextChannel, User } from "discord.js";
import { updateStars } from "../utils/functions/starboard";

export default class messageReactionRemoveEvent extends BaseEvent {
    constructor() {
        super("messageReactionRemove");
    }
    async run(client: DiscordClient, reaction: MessageReaction, user: User) {
        if (reaction.emoji.name !== "⭐") return;
        if (user.bot) return;
        reaction.fetch().catch((err) => {});
        const message = await reaction.message.fetch();
        if (!message.guild) return;
        if (!client.guildSettings.get(message.guild!.id)?.starboardSettings)
            return;
        const channel = client.guildSettings.get(message.guild.id)
            ?.starboardSettings?.channel;
        if (!channel) return;

        if (
            message.channelId === channel &&
            message.author.id !== client.user?.id
        )
            return;
        if (
            new Date().getTime() - reaction.message.createdTimestamp >
            1000 * 60 * 60 * 24 * 7
        )
            //message is not sent within the last 7 days (too old)
            return;
        if (message.author.id === user.id) {
            return;
        }
        if (
            message.channelId !== channel &&
            message.author.id !== client.user?.id &&
            reaction.count > 5
        )
            return;
        let starChannel = await client.channels.fetch(channel);
        if (
            !starChannel ||
            ![
                "GUILD_TEXT",
                "GUILD_PUBLIC_THREAD",
                "GUILD_NEWS_THREAD",
                "GUILD_PRIVATE_THREAD",
            ].includes(starChannel.type)
        )
            return;
        starChannel = starChannel as TextChannel;
        const wannabeStarMsgId =
            message.channelId === starChannel.id &&
            message.author.id === client.user?.id
                ? message.embeds[0].footer
                    ? message.embeds[0].footer.text
                          .split(":")[1]
                          .replace(/ +/g, "")
                    : message.id
                : message.id;
        //fetch last 50 messages
        const fetch = await starChannel.messages.fetch({
            limit: 50,
        });
        // the message in the starboard channel
        const starboardMessage = fetch.find(
            (m) =>
                m.author.id === client.user!.id &&
                m.embeds[0] &&
                m.embeds[0].footer!.text.includes(wannabeStarMsgId)
        ) as Message | null;
        // getting the channel id of the message if the message in starboard was starred
        const starboardMsgChannel = starboardMessage?.content
            .replace(/(<|>)/g, "")
            .split("#")[1];
        if (
            starboardMsgChannel !== message.channelId &&
            message.author.id !== client.user?.id
        ) {
            return updateStars(starboardMessage, reaction.count - 1);
        }
        if (!starboardMsgChannel) return;
        const sourceMsg = await (
            (await client.channels.fetch(starboardMsgChannel)) as TextChannel
        )?.messages.fetch(wannabeStarMsgId);
        const sourceMsgStarReaction = sourceMsg.reactions.cache.get("⭐");
        if (
            (await sourceMsgStarReaction?.users.fetch())?.has(user.id) ||
            sourceMsg.author.id === user.id
        ) {
            return;
        }
        return updateStars(
            starboardMessage,
            reaction.count +
                ((await sourceMsgStarReaction?.fetch())?.count || 0) -
                1
        );
    }
}
