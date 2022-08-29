import BaseEvent from "../structures/BaseEvent";
import DiscordClient from "../client/client";
import {
    Message,
    MessageReaction,
    PermissionResolvable,
    TextChannel,
    User,
} from "discord.js";
import { updateStars } from "../utils/functions/starboard";

export default class messageReactionRemoveEvent extends BaseEvent {
    constructor() {
        super("messageReactionRemove");
    }
    async run(client: DiscordClient, reaction: MessageReaction, user: User) {
        if (reaction.emoji.name !== "⭐") return;
        if (user.bot) return;
        await reaction.fetch().catch(() => {});
        const message = await reaction.message.fetch();
        if (!message.guild) return;
        if (!client.guildSettings.get(message.guild!.id)?.starboardSettings)
            return;
        const settings = client.guildSettings.get(message.guild.id)!
            .starboardSettings!;
        const channel = settings.channelId;
        if (!channel) return;
        const minCount = settings.minStars;

        if (
            message.author.id === user.id ||
            message.channelId === channel ||
            message.author.id === client.user?.id
        )
            return;
        //message is not sent within the last 7 days (too old)
        if (
            Date.now() / 1000 - reaction.message.createdTimestamp >
            1000 * 60 * 60 * 24 * 7
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
        return await updateStars(starboardMessage, reaction.count, minCount);
    }
}
