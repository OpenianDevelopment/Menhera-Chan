import DiscordClient from "../../client/client";
import { Message, MessageEmbed, TextChannel} from "discord.js";
import { getUserLevel, updateUserXP } from "../../database/functions/levelingOperation";

const userMap = new Map();

export async function exp(client:DiscordClient,message:Message){
    if(!message.guildId)return
    const guildSettings =  client.guildSettings.get(message.guildId)?.expSettings
    if(!guildSettings?.enable)return
    if(guildSettings.blacklistChannel.find(e => e == message.channelId))return
    if(userMap.has(message.author.id)){
        const userData = userMap.get(message.author.id);
        const difference = message.createdTimestamp - userData;
        if(difference>=guildSettings.timeDifference){
            userMap.set(message.author.id,message.createdTimestamp);
        }else{
            return
        }
    }else{
        userMap.set(message.author.id,message.createdTimestamp)
    }
    const userxp = await getUserLevel(message.guildId,message.author.id)
    if(userxp.level == 1500)return
    const newXP = userxp.xp + guildSettings.increment
    const level = Math.floor(Math.sqrt(newXP)*0.1)
    updateUserXP(message.author.id,newXP,level,message.guildId)
    if(level == 0)return
    if(level != userxp.level){
        const levelup = new MessageEmbed()
            .setThumbnail(message.author.displayAvatarURL({dynamic: true}))
            .setColor('#7289DA')
            .addField('Congratulations',`You have reached Level ${level}`)
        if(!guildSettings.expLogChannel){
            message.channel.send({embeds:[levelup],content:`${message.author}, Congratulations! \nYou Leveled up!`})
        }else if(guildSettings.expLogChannel){
            var log = message.guild?.channels.cache.find(channel => channel.id === guildSettings.expLogChannel) as TextChannel
            log.send({embeds:[levelup],content:`${message.author}, Congratulations! \nYou Leveled up!`})
        }else{
            message.channel.send({embeds:[levelup],content:`${message.author}, Congratulations! \nYou Leveled up!`})
        }
    }
}