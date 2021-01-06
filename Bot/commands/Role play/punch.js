const Discord = require("discord.js")
const {Rp} = require('../../function/dbfunctions')

module.exports = {
    name: 'punch',
    description: 'To punch someone',
    usage: '<user> [text]',
    category:'Role play',
    args: true,
    run:async(client,message,args,con,rcon)=> {
        const member = message.mentions.members.first();
        let text = `~ ${args.slice(1).join(" ")}`;
        var data = await Rp(`punch`)
        data = data[Math.floor(Math.random() * data.length)]
        if(!member)
        return message.reply(`Please mention a user to \`Punch\` 💪`);

        const rtxt = [
            `**${message.author.username} *punches* ${member.user.username}!**`,
            `**${member.user.username} cries cuz ${message.author.username} punched them**`,
            `**${message.author.username} punches ${member.user.username}, OOF!**`,
            `**${message.author.username} *punches* ${member.user.username}! :c**`,
        ];

        let rtext = rtxt[Math.floor(Math.random() * rtxt.length)];
        if(member.id === message.author.id) {
            return message.channel.send(`Not possible, That would be weird so try to mention someone`);
        }
        let embed = new Discord.MessageEmbed()
        .setDescription(`${rtext} ${text}`)
        .setImage(data.get(`img`))
        .setFooter(`RP id: ${data.get(`_id`)}`);
        return message.channel.send(embed);
    }
}