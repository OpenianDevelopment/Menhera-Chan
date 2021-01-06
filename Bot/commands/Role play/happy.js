const Discord = require("discord.js");
const {Rp} = require('../../function/dbfunctions');

module.exports = {
    name: 'happy',
    aliases: ["excited", "smile", "grin"],
    description: 'To show that you\'re happy...',
    category:'Role play',
    args: false,
    run:async(client,message,args)=> {
        let text = `~ ${args.join(" ")}`;
        var data = await Rp(`smile`)
        data = data[Math.floor(Math.random() * data.length)]

        const rtxt = [
            `**${message.author.username} is so happy *awoo***`,
            `**${message.author.username} seems so happy c:**`,
            `**${message.author.username} is happy :D**`,
            `**${message.author.username} smiles! c:**`,
        ];
        let rtext = rtxt[Math.floor(Math.random() * rtxt.length)];
        
        let embed = new Discord.MessageEmbed()
        .setDescription(`${rtext} ${text}`)
        .setImage(data.get(`img`))
        .setFooter(`RP id: ${data.get(`_id`)}`);
        return message.channel.send(embed);
    }
}