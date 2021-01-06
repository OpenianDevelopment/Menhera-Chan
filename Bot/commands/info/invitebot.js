const Discord = require('discord.js')
module.exports = {
    name: 'invitebot',
    aliases: ["invite"],
    description: 'Invite link to add the bot in your server',
    category:'info',
    run:(client,message,args,con,rcon)=>{
        const embed = new Discord.MessageEmbed()
            .setTitle(`${client.user.username}'s invite link`)
            .setDescription(`\[Press HERE\]\(https://discord.com/oauth2/authorize?client_id=731143954032230453&scope=bot&permissions=997321982\)`)
        message.channel.send(embed);       
    }
}