const Discord = require("discord.js");
const {Rp} = require('../../function/dbfunctions')

module.exports = {
    name: 'greet',
    description: 'To greet someone c;',
    aliases: ["hello"],
    usage: '<user> [text]',
    category:'Role play',
    args: true,
    run:async(client,message,args,con,rcon)=> {
        const member = message.mentions.members.first();
        let text = `~ ${args.slice(1).join(" ")}`;
        var data = await Rp(`greet`)
        data = data[Math.floor(Math.random() * data.length)]
        if(!member)
        return message.reply(`Please mention a user to \`greet\` them!!`);

        const rtxt = [
            `**${message.author.username} *greets* ${member.user.username}**`,
            `**hi there it seems like we got a new ${member.user.username}**`,
            `**${message.author.username} says hi to ${member.user.username}**`,
            `**hi there ${member.user.username}**`,
            `**${message.author.username} welcomes ${member.user.username}`
        ];
        let rtext = rtxt[Math.floor(Math.random() * rtxt.length)];
        if(member.id === message.author.id) return message.channel.send(`${message.author.username}-sama, You can't welcome yourself *baka*`)

        let embed = new Discord.MessageEmbed()
        .setDescription(`${rtext} ${text}`)
        .setImage(data.get(`img`))
        .setFooter(`RP id: ${data.get(`_id`)}`)
        return message.channel.send(embed);
    }
}