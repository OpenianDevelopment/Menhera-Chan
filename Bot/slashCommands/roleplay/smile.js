const { MessageEmbed } = require('discord.js');
const { interactionMsg } = require('../../function/functions');
const {Rp} = require('../../function/dbfunctions');
const Discord = require("discord.js");

module.exports = {
    name: 'smile', //user: not used 
    run: async(client,args,guild)=>{
        const author = await client.users.fetch(args.member.user.id);

        var data = await Rp(`smile`)
        data = data[Math.floor(Math.random() * data.length)]

        let text = `~ ${await args.data.options[0].value}`;
        if(!args.data.options[0]) text = " ";
        if(text.length>500) text = "~ Your text is too long";

        const rtxt = [ 
            `**${author.username} is so happy *awoo***`,
            `**${author.username} seems so happy c:**`,
            `**${author.username} is happy :D**`,
            `**${author.username} smiles! c:**`,
        ];

        let rtext = rtxt[Math.floor(Math.random() * rtxt.length)];

        const embed = new Discord.MessageEmbed()
        .setDescription(`${rtext} ${text}`)
        .setImage(data.get(`img`))
        .setFooter(`RP id: ${data.get(`_id`)}`);

        interactionMsg(client,args,embed)
    }
}