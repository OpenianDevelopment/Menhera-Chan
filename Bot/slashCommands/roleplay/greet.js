const { MessageEmbed } = require('discord.js');
const { interactionMsg } = require('../../function/functions');
const {Rp} = require('../../function/dbfunctions');
const Discord = require("discord.js");

module.exports = {
    name: 'greet', //user: required 
    run: async(client,args,guild)=>{
        if(!args.data.options[0]) {
            const embed = new MessageEmbed()
            .setDescription("You need to provide a user not yourself!")
            return interactionMsg(client,args,embed)
        }
        const author = await client.users.fetch(args.member.user.id);
        const member = await guild.members.fetch(args.data.options[0].value);

        var data = await Rp(`greet`)
        data = data[Math.floor(Math.random() * data.length)]

        let text = `~ ${await args.data.options[1].value}`;
        if(!args.data.options[1]) text = " ";
        if(text.length>500) text = "~ Your text is too long";

        const rtxt = [ 
            `**${author.username} *greets* ${member.user.username}**`,
            `**hi there it seems like we got a new ${member.user.username}**`,
            `**${author.username} says hi to ${member.user.username}**`,
            `**hi there ${member.user.username}**`,
            `**${author.username} welcomes ${member.user.username}`
        ];

        let rtext = rtxt[Math.floor(Math.random() * rtxt.length)];

        const embed = new Discord.MessageEmbed()
        .setDescription(`${rtext} ${text}`)
        .setImage(data.get(`img`))
        .setFooter(`RP id: ${data.get(`_id`)}`);

        interactionMsg(client,args,embed)
    }
}