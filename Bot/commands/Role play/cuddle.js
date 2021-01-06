const Discord = require("discord.js");
const {Rp} = require('../../function/dbfunctions')

module.exports = {
    name: 'cuddle',
    description: 'To cuddle with someone',
    usage: '<user> [text]',
    category:'Role play',
    args: true,
    run:async(client,message,args,con,rcon)=> {
        const member = message.mentions.members.first();
        let text = `~ ${args.slice(1).join(" ")}`;
        var data = await Rp(`cuddle`)
        data = data[Math.floor(Math.random() * data.length)]
        if(!member)
        return message.reply(`Please mention a user to \`Cuddle\` them UwU`);

        const rtxt = [
            `**OwO ${message.author.username} and ${member.user.username} looks cute together**`,
            `**${message.author.username} cuddles ${member.user.username}, adorable!**`,
            `***Cuddleeee***`
        ];

        let rtext = rtxt[Math.floor(Math.random() * rtxt.length)];

        if(member.id === message.author.id)
        rtext = `${message.author} *cuddles* themself \\😢`;

        let embed = new Discord.MessageEmbed()
        .setDescription(`${rtext} ${text}`)
        .setImage(data.get(`img`))
        .setFooter(`RP id: ${data.get(`_id`)}`)
        return message.channel.send(embed);
    }
}