const Discord = require("discord.js");
const {Rp} = require('../../function/dbfunctions')

module.exports = {
    name: 'bite',
    description: 'To bite someone',
    usage: '<user> [text]',
    category:'Role play',
    args: true,
    run:async(client,message,args,con,rcon)=> {
        const member = message.mentions.members.first();
        let text = `~ ${args.slice(1).join(" ")}`;
        var data = await Rp(`bite`)
        data = data[Math.floor(Math.random() * data.length)]
        if(!member)
        return message.reply(`Please mention a user to \`bite\` them \\🍴`);

        const rtxt = [
            `**${message.author.username} *bites* ${member.user.username}**`,
            `**Ouch looks like it hurts**`,
            `**AAAAAAAAAAAAAAA ${member.user.username} is bleding**`,
            `**${message.author.username} goes to prison for killing ${member.user.username} with a critical bite** \n<:OkayChamp:715611660571902055>`
        ];
        let rtext = rtxt[Math.floor(Math.random() * rtxt.length)];
        if(member.id === message.author.id)
        rtext = `${message.author} bites themself!?? `;

        let embed = new Discord.MessageEmbed()
        .setDescription(`${rtext} ${text}`)
        .setImage(data.get(`img`))
        .setFooter(`RP id: ${data.get(`_id`)}`)
        return message.channel.send(embed);
    }
}