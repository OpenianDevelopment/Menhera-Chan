import DiscordClient from "../../client/client";
import { Message, MessageEmbed, TextChannel } from "discord.js";
import {
    getUserLevel,
    updateUserXP,
} from "../../database/functions/levelingOperation";
import { updateUserData } from "../../database/functions/UserFunctions";
import { ReportBug } from "./Custom";

const userMap = new Map();

export async function exp(client: DiscordClient, message: Message) {
    if (!message.guildId) return;
    const guildSettings = client.guildSettings.get(
        message.guildId
    )?.expSettings;
    if (!guildSettings?.enable) return;
    if (guildSettings.blacklistChannel.find((e) => e == message.channelId))
        return;
    if (userMap.has(message.author.id)) {
        const userData = userMap.get(message.author.id);
        const difference = message.createdTimestamp - userData;
        if (difference >= guildSettings.timeDifference) {
            userMap.set(message.author.id, message.createdTimestamp);
        } else {
            return;
        }
    } else {
        userMap.set(message.author.id, message.createdTimestamp);
    }
    const userxp = await getUserLevel(message.guildId, message.author);
    if (userxp.level == 1500) return;
    const newXP = userxp.xp + guildSettings.increment;
    const level = Math.floor(Math.sqrt(newXP) * 0.1);
    if (
        await updateUserData(
            message.author.id,
            message.author.tag,
            message.author.avatar
                ? message.author.avatar
                : (parseInt(message.author.discriminator) % 5).toString(),
            message.guild!.id
        )
    ) {
        updateUserXP(message.author.id, newXP, level, message.guildId);
    } else {
        return ReportBug(
            "Cannot save UserData to the db (user didn't get exp)\n\n*Check console for details*",
            client.user!
        );
    }
    if (level == 0) return;
    if (level != userxp.level) {
        const levelup = new MessageEmbed()
            .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
            .setColor("#7289DA")
            .addField("Congratulations", `You have reached Level ${level}`);
        if (!guildSettings.expLogChannel) {
            message.channel.send({
                embeds: [levelup],
                content: `${message.author}, Congratulations! \nYou Leveled up!`,
            });
        } else if (guildSettings.expLogChannel) {
            const log = message.guild?.channels.cache.find(
                (channel) => channel.id === guildSettings.expLogChannel
            ) as TextChannel;
            log.send({
                embeds: [levelup],
                content: `${message.author}, Congratulations! \nYou Leveled up!`,
            });
        } else {
            message.channel.send({
                embeds: [levelup],
                content: `${message.author}, Congratulations! \nYou Leveled up!`,
            });
        }
    }
}
