const Discord = require("discord.js");
const {Rp} = require('../../function/dbfunctions')

module.exports = {
    name: 'bully',
    description: 'To bully someone',
    usage: '<user> [text]',
    category:'Role play',
    args: true,
    run:async(client,message,args,con,rcon)=> {
        const member = message.mentions.members.first();
        let text = `~ ${args.slice(1).join(" ")}`;
        var data = await Rp(`bully`)
        data = data[Math.floor(Math.random() * data.length)]
        if(!member)
        return message.reply(`Please mention a user to \`Bully\` them....`);

        const rtxt = [
            `**Oh look the big bully ${message.author.username} has arrived**`,
            `**${member.user.username} is crying from bullying**`,
            `**${message.author.username} *bullies* ${member.user.username}!! Hehe!**`,
        ];
        let rtext = rtxt[Math.floor(Math.random() * rtxt.length)];
        if(member.id === message.author.id)
        rtext = `Ummmm.. ${message.author} can't find anyone to bully so they bullies themself!`;

        let embed = new Discord.MessageEmbed()
        .setDescription(`${rtext} ${text}`)
        .setImage(data.get(`img`))
        .setFooter(`RP id: ${data.get(`_id`)}`)
        return message.channel.send(embed);
    }
}