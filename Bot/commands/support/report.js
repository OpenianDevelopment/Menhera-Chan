const Discord = require('discord.js');
const {bl} = require(`../../function/dbfunctions`)
module.exports = {
    name: 'report',
    aliases: ["bugreport"],
    description: 'reports issue with the bot',
    category:'support',
    args: false,
    run:async(client,message,args)=>{
        var userban = await bl(message.author.id,'user')
        var guildban = await bl(message.guild.id,'guild')
        if(userban != null) return message.channel.send(`you have been blacklisted from using this command`)
        if(guildban != null) return message.channel.send(`you have been blacklisted from using this command`)
        const embed = new Discord.MessageEmbed()
                        .setTitle('Bug Report')
                        .setDescription("You you like to report a bug?(Yes/No)")
        var botmsg = await message.channel.send(embed)
        answer = await message.channel.awaitMessages(answer=>answer.author.id===message.author.id,{max: 1});
        agree = (answer.map(answers=>answers.content)).join()
        await answer.map(answer=>answer.delete())
        if(agree.toLowerCase() != "yes") return botmsg.edit("The process has been terminated");
        embededit(botmsg,"Please Describe the bug")
        answer1 = await message.channel.awaitMessages(answer=>answer.author.id===message.author.id,{max: 1});
        reply = (answer1.map(answers=>answers.content)).join()
        await answer1.map(answer=>answer.delete())
        embededit(botmsg,"Thank you for reporting"+`\n`+`Your Report: ${reply}`)
        
        const embed1 = new Discord.MessageEmbed()
        .setTitle('Incoming Bug Report')
        .setDescription(`${reply}`)
        .addField(`Author:`, `${message.author} ( \`${message.author.id}\` )`)
        
        const guild = client.guilds.cache.get("735899211677041099");
        guild.channels.cache.find(channel=>channel.id===`735904379303100442`).send(embed1);
    }
}
function embededit(botmsg,info){
    const embed = new Discord.MessageEmbed()
                        .setTitle('Bug Report')
                        .setDescription(`${info}`)

        botmsg.edit(embed);
}