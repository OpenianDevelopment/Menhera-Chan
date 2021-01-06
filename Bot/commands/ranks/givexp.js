const {addXP, getXP} = require('../../function/dbfunctions');
const Discord = require('discord.js')
module.exports = {
    name:'givexp',
    category: 'ranks',
    description: 'to add or remove xp',
    usage: '<user> <level>',
    args:true,
    role:'MenheraMod',
    permission: 'MANAGE_CHANNELS',
    run: async (client,message,args)=>{
        var member = message.mentions.members.first()||await message.guild.members.fetch(args[0])
        if(!member.user) return message.channel.send('Please mention a user');
        if(isNaN(args[1])) return message.channel.send('Level should be a number');
        userXP = await getXP(member.user.id,message.guild.id);
        if(!userXP) return message.channel.send('This member is not cached in our XP system')
        var xp = parseInt(args[1]);
        xp = xp+userXP.users[0].xp;
        if(xp<0) return message.channel.send('Can\'t deduct xp more than what user have')
        
        var level = parseInt(0.1*Math.sqrt(xp));
        
        if(level>1500){
            level = 100;
            xp = (level*level)/0.01;
            
        }
        else if(level<0){
            level = 0
            xp = 0
        }
        minxp = (level*level)/0.01;
        maxxp = ((level+1)*(level+1))/0.01;
        
        await addXP(message.guild.id,member.user.id,xp,level,minxp,maxxp);
        const givenXP = new Discord.MessageEmbed()
                            .setDescription(`${xp} XP has been set for ${member}`)
        message.channel.send(givenXP)
        if(level===userXP.users[0].level) return;
        
        const levelup = new Discord.MessageEmbed()
                                .setThumbnail(member.user.displayAvatarURL({dynamic: true}))
                                .setColor('#7289DA')
                                .addField('Congratulations',`You have reached Level ${level}`)
                                .setFooter(`${message.guild.name} | https://menhera-chan.tk `)

        if(message.guild.botSetting.xplog===null){
            message.channel.send(`${member}, Congratulations!`);
            message.channel.send(levelup)
            return;
        }
        var log = message.guild.channels.cache.find(channel=>channel.id===message.guild.botSetting.xplog);
        if(!log) return;
        log.send(`${member}, Congratulations!`)    
        log.send(levelup)

        

    }
    
}