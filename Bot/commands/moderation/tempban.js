const Discord = require('discord.js');
const {addModeration,getModerationOne,removeModeration} = require('../../function/dbfunctions');
const { sendModLog,sendModLogAuto } = require('../../function/functions')
const ms = require('ms');
module.exports = {
    name: 'tempban',
    description: 'Ban a user for given time',
    category:'moderation',
    usage: '<user> <time> [reason]',
    permission: 'BAN_MEMBERS',
    botPermission: 'BAN_MEMBERS',
    args: true,
    run:async(client,message,args)=>{
        //gets member and checks if member is in server with perms
        var member = await message.mentions.members.first() || await message.guild.members.fetch(args[0])
        if(!member.user) return message.channel.send('User not found');
        if(member.hasPermission('BAN_MEMBERS')) return message.channel.send('You can\'t Ban this user');
        //gets server mute role and checks if it has one
        var time
        try{
            time = ms(args[1])
        }
        catch{
            return message.channel.send('Please mention a time')
        } 
        
        var reason= args.slice(2).join(' ');
        
        
        const embed = new Discord.MessageEmbed()
                            .setAuthor(`Banned`,member.user.displayAvatarURL())
                            .setColor('RED')
                            .setDescription(`You have been Banned from \`\`${message.guild.name}\`\``)
                            .addField('Banned for', args[1], true)
        const embed1 = new Discord.MessageEmbed()
                            .setAuthor(`Banned`,member.user.displayAvatarURL())
                            .setColor('RED')
                            .setDescription(`${member.user.username} has been BAnned`)
                            .addField('Banned by', message.author, true)
                            .addField('Banned for', args[1], true)
       
            if(reason){
                embed.addField('Reason',`${reason}`)
                embed1.addField('Reason',`${reason}`)
            }
            else{
                embed.addField('Reason',`No Reason Given.`)
                embed1.addField('Reason',`No Reason Given.`)
            }
            message.channel.send(embed1);
            sendModLog(message,message.guild.botSetting.logchannel,`Tempban`,null,member,reason,args[1],client)
            member.send(embed).catch(function(err){
                message.channel.send("Can't inform user. User Banned")
            })
            member.ban(reason)
            var newtime = Date.now() + time;
            var banid = addModeration(message.guild.id,member.user.id,'ban',newtime);
                setTimeout(async function(){
                    var checkBan = await getModerationOne(message.guild.id,banid)
                    if(checkBan==null) return
                    var ban = await message.guild.fetchBans();
                    var mem = ban.get(member.user.id);
                    if(!mem) return removeModeration(message.guild.id,member.user.id,'ban')
                    await message.guild.members.unban(mem.user.id) 
                    const unBan = new Discord.MessageEmbed()
                            .setAuthor(`Unbanned`,member.user.displayAvatarURL())
                            .setColor('GREEN')
                            .setDescription(`${member.user.username} has been Unbanned`)
                            .addField('Unbanned by', client.user, true)
                    sendModLogAuto(message.guild,message.guild.botSetting.logchannel,unBan,client)
                    removeModeration(message.guild.id,member.user.id,'ban')
                },time);
    }


}
