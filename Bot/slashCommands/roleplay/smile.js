const { MessageEmbed } = require('discord.js');
const { interactionMsg } = require('../../function/functions');
const {Rp} = require('../../function/dbfunctions');
const Discord = require("discord.js");

module.exports = {
    name: 'smile', //user: not used 
    run: async(client,args,guild)=>{
        const me = await guild.members.fetch(client.user.id);
        if(!me.permissionsIn(args.channel_id).has(["SEND_MESSAGES", "EMBED_LINKS"])) return;
        
        const author = await client.users.fetch(args.member.user.id);

        var data = await Rp(`smile`)
        data = data[Math.floor(Math.random() * data.length)]

        var text;
        if (!args.data.options) {
            text = " ";
        } else if (args.data.options[0].length > 500) { 
            text = "~ Your text is too long" 
        } else {
            text = `~ ${await args.data.options[0].value}`;
        };

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
        .setFooter(`author: ${author.username}, id: ${data.get(`_id`)}`, author.displayAvatarURL());

        interactionMsg(client,args,embed,null,[])
    }
}