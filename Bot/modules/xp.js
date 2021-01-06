const dbfunctions = require('../function/dbfunctions');
const { getXPBlacklist } = require('../function/dbfunctions');
const Discord = require(`discord.js`)
var newxp;
var minxp;
var maxxp;
module.exports = async function(client,message){
    
    if(message.guild.botSetting.xpsystem === 0) return
    
    var xpchannel = await getXPBlacklist(message.guild.id);
    var flag = 1
    xpchannel.channels.forEach(c=>{
        if(c.channel===message.channel.id)
            flag=0
    })
    if(flag===0) return;
    
    var userXP = await dbfunctions.getXP(message.author.id,message.guild.id); //getting xp detail
    if(userXP == null){
        dbfunctions.addXP(message.guild.id,message.author.id,1,0,0,100)
        return
    }
    if(userXP.users[0].level===1500) return;
    if(message.author.lastxp){ //checking if last message is here or not
        const timeDiff = message.createdTimestamp - message.author.lastxp; //checking timedifference for cooldown
        if(timeDiff>message.guild.botSetting.xpcooldown){
            newxp = userXP.users[0].xp+message.guild.botSetting.xp //getting new xp
            message.author.lastxp = message.createdTimestamp;
            var level =parseInt(Math.sqrt(newxp)*0.1) //calculating level
            minxp = (level*level)/(0.01)
            maxxp = ((level+1)*(level+1))/(0.01)
            dbfunctions.addXP(message.guild.id,message.author.id,newxp,level,minxp,maxxp)
            if(level!=userXP.users[0].level){ //checking level
                const levelup = new Discord.MessageEmbed()
                                .setThumbnail(message.author.displayAvatarURL({dynamic: true}))
                                .setColor('#7289DA')
                                .addField('Congratulations',`You have reached Level ${level}`)
                                .setFooter(`${message.guild.name} | https://menhera-chan.in `)
                if(message.guild.botSetting.xplog===null){
                    if(!message.channel.permissionsFor(client.user.id).has(`SEND_MESSAGES`))return
                    if(!message.channel.permissionsFor(client.user.id).has(`EMBED_LINKS`))return message.reply('Congratulations',`You have reached Level ${level}`)
                    message.channel.send(`${message.author}, Congratulations! \nYou Leveled up!`, levelup);
                }
                else{
                    var log = await message.guild.channels.cache.find(channel=>channel.id===message.guild.botSetting.xplog);
                    if(log==undefined){
                        if(!message.channel.permissionsFor(client.user.id).has(`SEND_MESSAGES`))return
                        if(!message.channel.permissionsFor(client.user.id).has(`EMBED_LINKS`))return message.reply('Congratulations',`You have reached Level ${level}`)
                        message.channel.send(`${message.author}, Congratulations! \nYou Leveled up!`, levelup);
                    }else{
                        if(!log.permissionsFor(client.user.id).has(`SEND_MESSAGES`))return
                        if(!log.permissionsFor(client.user.id).has(`EMBED_LINKS`))return message.reply('Congratulations',`You have reached Level ${level}`)
                        log.send(`${message.author}, Congratulations! \nYou Leveled up!`, levelup);
                    }
                }
                
            }
            //changing xp and level
        }
    }
    else{
        message.author.lastxp = message.createdTimestamp;
    }    
}