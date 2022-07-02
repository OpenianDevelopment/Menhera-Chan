import BaseEvent from "../structures/BaseEvent";
import DiscordClient from "../client/client";
import {
    Message,
    MessageReaction,
    PermissionResolvable,
    TextChannel,
    User,
} from "discord.js";
import { SendStarMessage } from "../utils/functions/starboard";

export default class messageReactionAddEvent extends BaseEvent {
    constructor() {
        super("messageReactionAdd");
    }
    async run(client: DiscordClient, reaction: MessageReaction, user: User) {
        // starboard stuff
        if (reaction.emoji.name !== "⭐") return;
        if (user.bot) return;
        // fetch reaction info
        await reaction.fetch().catch(() => {});
        // fetch reaction message
        const message = await reaction.message.fetch();
        // ignore if no/unavailable guild
        if (!message.guild) return;
        // ignore if no guild settings data
        if (!client.guildSettings.get(message.guild!.id)?.starboardSettings)
            return;
        const channel = client.guildSettings.get(message.guild.id)
            ?.starboardSettings?.channelId;
        if (!channel) return;
        const minCount = 5;

        if (
            message.channelId === channel &&
            message.author.id !== client.user?.id
        )
            return;
        // client's permission in the channel
        const myPerms = (message.channel as TextChannel).permissionsFor(
            client.user!.id
        );
        const neededPerms: PermissionResolvable[] = [
            "MANAGE_MESSAGES",
            "ADD_REACTIONS",
            "READ_MESSAGE_HISTORY",
            "EMBED_LINKS",
            "ATTACH_FILES",
        ];
        if (!myPerms?.has(neededPerms)) {
            if (myPerms?.has("SEND_MESSAGES")) {
                message.channel.send({
                    content: `Make sure i have **${neededPerms
                        .slice(0, neededPerms.length - 2)
                        .map((perm) => `\`${perm.toString()}\``)
                        .join(", ")} and ${neededPerms[
                        neededPerms.length - 1
                    ].toString()}**`,
                });
            }
        }
        if (
            Date.now() / 1000 - reaction.message.createdTimestamp >
            1000 * 60 * 60 * 24 * 7
        )
            //message is not sent within the last 7 days (too old)
            return;
        if (message.author.id === user.id) {
            reaction.users.remove(user).catch(() => {});
            return;
        }
        if (
            message.channelId !== channel &&
            message.author.id !== client.user?.id &&
            reaction.count < minCount
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
                (m.embeds[0].footer?.text?.includes(wannabeStarMsgId) || false)
        ) as Message | null;
        // getting the channel id of the message if the message in starboard was starred
        const starboardMsgChannel = starboardMessage?.content
            .replace(/(<|>)/g, "")
            .split("#")[1];
        if (
            message.channelId !== channel &&
            starboardMsgChannel !== message.channelId &&
            message.author.id !== client.user?.id
        ) {
            return await SendStarMessage(
                starChannel,
                starboardMessage,
                reaction.count,
                message
            );
        }
        if (!starboardMsgChannel) return;
        const sourceMsg = await (
            (await client.channels.fetch(starboardMsgChannel)) as TextChannel
        )?.messages.fetch(wannabeStarMsgId);
        const sourceMsgStarReaction = sourceMsg.reactions.cache.get("⭐");
        const fetchReactionUsers = await sourceMsgStarReaction?.users.fetch();
        if (
            fetchReactionUsers?.has(user.id) ||
            sourceMsg.author.id === user.id
        ) {
            reaction.users.remove(user).catch(() => {});
            return;
        }
        return await SendStarMessage(
            starChannel,
            starboardMessage,
            reaction.count + (sourceMsgStarReaction?.count || 0) - 1,
            sourceMsg
        );
    }
}
