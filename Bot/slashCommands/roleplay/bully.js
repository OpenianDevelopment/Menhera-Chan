const { MessageEmbed } = require('discord.js');
const { interactionMsg } = require('../../function/functions');
const {Rp} = require('../../function/dbfunctions');
const Discord = require("discord.js");

module.exports = {
    name: 'bully',//user: required 
    run: async(client,args,guild)=>{
        const author = await client.users.fetch(args.member.user.id);
        if(!args.data.options[0]) {
            const embed = new MessageEmbed()
            .setDescription("You need to provide a user not yourself!")
            return interactionMsg(client,args,embed)
        }
        const member = await guild.members.fetch(args.data.options[0].value);

        var data = await Rp(`bully`)
        data = data[Math.floor(Math.random() * data.length)]

        let text = `~ ${await args.data.options[1].value}`;
        if(!args.data.options[1]) text = " ";
        if(text.length>500) text = "~ Your text is too long";

        const rtxt = [ 
            `**Oh look the big bully ${author.username} has arrived**`,
            `**${member.user.username} is crying from bullying**`,
            `**${author.username} *bullies* ${member.user.username}!! Hehe!**`,
        ];

        let rtext = rtxt[Math.floor(Math.random() * rtxt.length)];

        const embed = new Discord.MessageEmbed()
        .setDescription(`${rtext} ${text}`)
        .setImage(data.get(`img`))
        .setFooter(`RP id: ${data.get(`_id`)}`);

        interactionMsg(client,args,embed)
    }
}