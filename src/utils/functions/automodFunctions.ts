import DiscordClient from "../../client/client";
import {Guild, Message, MessageEmbed, Snowflake, TextChannel, User} from "discord.js";
import {sendModLogs} from "./modFunction";
import {addModerations, updateModerations} from "../../database/functions/modOperation";

export async function AutoMute(client: DiscordClient, user: User, time: number, reason: string, guild: Guild) {
    const member = await guild.members.fetch(user.id).catch(err => {
        return null;
    });
    if (!member) return;
    const {muterole} = client.guildConfig.get(guild.id);
    if (!muterole) return;
    await member.roles.add(muterole as Snowflake);
    if (!client.user) return;
    sendModLogs(client, 'Auto Mute', client.user, user, reason, guild.id, time);
    const mute_id = await addModerations(guild.id, user, 'Auto Moderator', time);

    setTimeout(async () => {
        await member.roles.remove(muterole as Snowflake);
        if (!client.user) return;
        sendModLogs(client, 'Auto Unmute', client.user, user, "Time Expired", guild.id);
        await updateModerations(mute_id, guild.id);
    },time);
}

export async function AutoWarn(user:User, channel:TextChannel, reason:string){
    const embed = new MessageEmbed().setColor('RED').setDescription(reason).setTitle('Auto Warn').setTimestamp();
    channel.send({
        content: `<@${user.id}>`,
        embeds: [embed]
    }).then((message:Message)=>{
        setTimeout(()=>message.delete(), 5000);
    });
}
export async function AutoDelete(messages:Snowflake[], channel: TextChannel){
    await channel.bulkDelete(messages);
}