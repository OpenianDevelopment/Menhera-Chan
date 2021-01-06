const Discord = require('discord.js')
module.exports = {
    name: 'flip',
    description: 'Flips a coin',
    category:'fun',
    args: false,
    run:(client,message,args)=>{
        var num = Math.floor(Math.random() * 3);
        if(num > 1){
            num = "head"
        }else{
            num = "tails"
        }
        const embed = new Discord.MessageEmbed()
                        .setTitle('Coin Flip')
                        .setThumbnail(`https://cdn.discordapp.com/attachments/715192953957515346/731653756109979648/5291f56897d748b1ca0a10c90023588d.gif`)
                        .setDescription(`You flpped a coin`)
                        .addField(`You got:`,`${num}`)
        message.channel.send(embed);
               
    }
}