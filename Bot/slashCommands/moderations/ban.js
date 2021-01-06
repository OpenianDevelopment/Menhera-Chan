const { MessageEmbed } = require('discord.js')
const { sendModLog, interactionMsg } = require('../../function/functions')
module.exports = {
    name: 'ban',
    run: async(client,args)=>{
        const guild = client.guilds.cache.get(args.guild_id);
        if((args.member.permissions&0x4)!==0x4){
            const embed = new MessageEmbed()
                        .setTitle('Missing Permission')
                        .setColor('RED')
                        .setDescription(`Oh no! I don't have \`\`BAN MEMBERS\`\` permission to perform this command. Can you be a Sugar Pie and give me those permission`)
            return interactionMsg(client,args,embed)
        }
        const author = await guild.members.fetch(args.member.user.id);
        
        const member = await guild.members.fetch(args.data.options[0].value);
        if(!member.bannable){
            const embed = new MessageEmbed().setDescription('Damn it! I can\'t ban this user. Sorry honey I think he might have higher or same authority as me').setColor('RED')
        }
        let reason = null ;
        if(args.data.options.length === 2){
            reason = args.data.options[1].value;
        }
        const embed = new MessageEmbed()
                            .setAuthor(`Banned ${member.user.username}`,member.user.displayAvatarURL())
                            .setColor('RED')
                            .setDescription(`You have been Banned from \`\`${guild.name}\`\``)
                            
        const embed1 = new MessageEmbed()
                            .setAuthor(`Banned ${member.user.username}`,member.user.displayAvatarURL())
                            .setColor('RED')
                            .setDescription(`${member.user.username} have been Banned`)
                            .addField('Banned by', author, true)
       
            if(reason){
                embed.addField('Reason',`${reason}`)
                embed1.addField('Reason',`${reason}`)
            }
            else{
                embed.addField('Reason',`No Reason Given.`)
                embed1.addField('Reason',`No Reason Given.`)
            }
            
            member.send(embed).catch(function(err){
                
            })
                
            member.ban({reason: reason})
            interactionMsg(client,args,embed)
            // sendModLog(message,message.guild.botSetting.logchannel,`Ban`,message.channel.id,member,reason,message.author,client)

        
    }
}