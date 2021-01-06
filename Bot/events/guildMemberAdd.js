const Discord = require("discord.js");
const globalFunc =  require('../function/functions');
const {getGuildSetting} = require('../function/dbfunctions')
const {getWelcomeRole} = require('../function/dbfunctions(2)')

module.exports = async (client,member)=>{
    
    if(member.user.bot) return;
    
    
    
    var guildSet = await getGuildSetting(member.guild.id) //getting guild data
        
        globalFunc.welcomeMsg(member,member.guild,guildSet)
        
            var welcomeRole = await getWelcomeRole(member.guild.id);
            if(welcomeRole.roles.length>0){
                welcomeRole.roles.forEach(async r=>{

                        member.roles.add(r).catch(async e=>{
                            if(guildSet.logchannel === null)return
                            var channel = await member.guild.channels.cache.find(channel=>channel.id===guildSet.logchannel);
                            if(!channel.permissionsFor(client.user.id).has(`SEND_MESSAGES`))return
                            const embed = new Discord.MessageEmbed().setDescription(`Oh no! Something went wrong while assigning role <@&${r}>. Make sure i have MANAGE ROLES permission and My role is higher. Thanks in advance honey`).setColor('RED')
                            channel.send(embed).catch(err=>{console.log(err)});	
                        })   
                })
            }
         
    //getting cached invite
    if(!member.guild.me.hasPermission(`MANAGE_GUILD`)) return
    const CachedInvites = client.invite.get(member.guild.id);
    const newInvites = await member.guild.fetchInvites();
    client.invite.set(member.guild.id, newInvites);
    var usedInvite;
    try{
       usedInvite = newInvites.find(inv=>inv.uses>CachedInvites.get(inv.code).uses);
       
        
        
    }
    catch{
        usedInvite = null;
    }
    //creating log and sending it
        const InviteLog = new Discord.MessageEmbed()
                            .setAuthor(`Member Joined`, member.user.displayAvatarURL())
                            .setDescription(`${member} - ${member.user.tag}`)
        if(usedInvite==null || !usedInvite.inviter){
            InviteLog.addField('Inviter', 'Not Found',true)
                     .setColor('RED')
                     .addField('Invite Code', 'None of the invites have changed. Perhaps this member joined using a guilds.join connection? or Invite is created from the channel i don\'t have access to.',true)

        }
        else{
            InviteLog.addField('Inviter', usedInvite.inviter.username,true)
                     .setColor('GREEN')
                     .addField('Member', `${member} joined using ${usedInvite.code}`,true)
                     .addField('Uses:', usedInvite.uses,true)
        }
        var inviteChannel = await member.guild.channels.cache.find(channel=>channel.id===guildSet.invitelog)
        if(inviteChannel == undefined) return;
        if(!inviteChannel.permissionsFor(client.user.id).has(`SEND_MESSAGES`)) return;
        if(!inviteChannel.permissionsFor(client.user.id).has(`EMBED_LINKS`)) return inviteChannel.send('Please provide Permission to send embed links')
        inviteChannel.send(InviteLog).catch(err=>{
            console.log(err);
        })
}