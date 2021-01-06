const Discord = require("discord.js");
const {Rp} = require('../../function/dbfunctions')

module.exports = {
    name: 'kill',
    description: 'To kill someone (in rp)',
    usage: '<user> [text]',
    category:'Role play',
    args: true,
    run:async(client,message,args,con,rcon)=> {
        const member = message.mentions.members.first();
        var data = await Rp(`kill`)
        data = data[Math.floor(Math.random() * data.length)]
        if(!member)
        return message.reply(`Please mention a user to \`kill\` them \\🔫`);
        const rtxt = [
            `**${message.author.username} killed ${member.user.username}**`
        ];
        let rtext = rtxt[Math.floor(Math.random() * rtxt.length)];
        let text = `~ ${args.slice(1).join(" ")}`;

        if(member.id === message.author.id)
        return message.channel.send(`OK you are **\`"DEAD"\`**, Now please mention someone`);

        let embed = new Discord.MessageEmbed()
        .setDescription(`${rtext} ${text}`)
        .setImage(data.get(`img`))
        .setFooter(`RP id: ${data.get(`_id`)}`)
        return message.channel.send(embed);
    }
}