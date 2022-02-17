import DiscordClient from "../../client/client";
import { MessageEmbed, PermissionResolvable, TextChannel} from "discord.js";
import {
    CommandInteraction,
} from "discord.js";

export async function CheckPerms(interaction:CommandInteraction,userID:string|undefined,perms:PermissionResolvable | Array<PermissionResolvable>) {
    if(userID == undefined || null){return false}
    let member = await interaction.guild?.members.fetch(userID)
    if(member == undefined||null)return false
    if(member?.permissions.has(perms)){
        return true
    }
    return false
}
export async function CheckPermsBoth(interaction:CommandInteraction,perms:PermissionResolvable | Array<PermissionResolvable>) {
    let member = await interaction.guild?.members.fetch(interaction.user.id)
    let bot = await interaction.guild?.members.fetch(interaction.client.user!.id)
    if(!member?.permissions.has(perms)){
        interaction.followUp({
            content:`You don't have permission todo this, you need:\n${perms}`
        })
        return false
    }
    if(! bot?.permissions.has(perms)){
        interaction.followUp({
            content:`Permission required to do this:\n${perms}`
        })
        return false
    }
    return true
}
export async function ModLog(client:DiscordClient,guildID:string,embed:MessageEmbed){
    var guildOption = client.guildSettings.get(guildID)
    if(!guildOption?.moderationSettings?.modLogChannel)return
    var guild = await client.guilds.fetch(guildID)
    var Modchannel = await guild.channels.fetch(guildOption?.moderationSettings?.modLogChannel) as TextChannel
    if(!Modchannel)return
    embed.setTimestamp()
    Modchannel.send({embeds:[embed]})
}
export async function getAudituser(value:any) {
    var data;
    try{
        var user = (await value.guild.fetchAuditLogs({type:12})).entries.first()?.executor
        if(user){
            data = {name:"By User",value:`\`${user.username}(${user.id})\``}
        }else{
            data = {name:"By User",value:`Something went wrong`}
        }
    }catch{
        data = {name:"By User",value:"audit log perm is required to veiw this"}
    }
    return data
}