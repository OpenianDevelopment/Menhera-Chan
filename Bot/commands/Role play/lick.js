const Discord = require("discord.js");
const {Rp} = require('../../function/dbfunctions')

module.exports = {
    name: 'lick',
    description: 'To lick someone',
    usage: '<user> [text]',
    category:'Role play',
    args: true,
    run:async(client,message,args,con,rcon)=> {
        const member = message.mentions.members.first();
        var data = await Rp(`lick`)
        data = data[Math.floor(Math.random() * data.length)]
        if(!member)
        return message.reply(`Please mention a user to \`lick\` them \\😋`);
        const rtxt = [
            `**Woah ${message.author.username} licked ${member.user.username}**`,
            `**${message.author.username} *licks* ${member.user.username} lick lick lick**`,
            `**\`${member.user.username}\` is being licked by \`${message.author.username}\`**`
        ];
        let rtext = rtxt[Math.floor(Math.random() * rtxt.length)];
        let text = `~ ${args.slice(1).join(" ")}`;

        if(member.id === message.author.id)
        rtext = `${message.author} licked themself`;

        let embed = new Discord.MessageEmbed()
        .setDescription(`${rtext} ${text}`)
        .setImage(data.get(`img`))
        .setFooter(`RP id: ${data.get(`_id`)}`)
        return message.channel.send(embed);
    }
}