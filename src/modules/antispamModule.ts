import DiscordClient from "../client/client";
import {Message, Snowflake, TextChannel} from "discord.js";
import {userSpam} from "../utils/interfaces/generalInterfaces";
import {getAntispamData} from "../database/functions/automodOperation";
import {AutoDelete, AutoMute, AutoWarn} from "../utils/functions/automodFunctions";

export default async function antispam(client: DiscordClient, message: Message) {
    if (!message.guild) return;
    if (message.channel.type === 'dm') return;
    if (message.member?.permissions.has('MANAGE_MESSAGES')) return;
    if (client.guildAntispam.has(message.guild.id) && client.guildAntispam.get(message.guild.id)?.users.has(message.author.id)) {
        const guildAntispam = client.guildAntispam.get(message.guild.id);
        if (!guildAntispam) return;
        const user = guildAntispam.users.get(message.author.id);
        if (!user) return;
        if (message.createdTimestamp - user.lasTimestamp <= guildAntispam.difference) {
            user.count++;
            if (user.count === guildAntispam.count) {
                if (guildAntispam.mute)
                    await AutoMute(client, message.author, 1000 * 60 * 20, `Spamming in <#${message.channel.id}>`, message.guild);
                if (guildAntispam.warn)
                    await AutoWarn(message.author, message.channel as TextChannel, "Please Don't spam");
                if (guildAntispam.deleteMsg)
                    await AutoDelete(user.message, message.channel as TextChannel);
                user.lasTimestamp = message.createdTimestamp;
                user.message = [message.id];
                user.count = 1;
            } else {
                user.message.push(message.id);
            }
        } else {
            user.lasTimestamp = message.createdTimestamp;
            user.message = [message.id];
            user.count = 1;
        }
    } else {
        if (!client.guildAntispam.has(message.guild.id)) {
            const {count, mute, channels, difference, warn, deleteMsg} = await getAntispamData(message.guild.id);
            const users = new Map<Snowflake, userSpam>().set(message.author.id, {
                count: 1,
                lasTimestamp: message.createdTimestamp,
                message: [message.id]
            });
            client.guildAntispam.set(message.guild.id, {
                users: users,
                count: count,
                deleteMsg: deleteMsg,
                mute: mute,
                warn: warn,
                difference: difference,
                channels: channels
            });
        } else {
            const guildAntiSpam = client.guildAntispam.get(message.guild.id);
            if (guildAntiSpam)
                guildAntiSpam.users.set(message.author.id, {
                    count: 1,
                    lasTimestamp: message.createdTimestamp,
                    message: [message.id]
                });
        }
    }

}