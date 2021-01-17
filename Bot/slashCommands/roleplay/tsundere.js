const { MessageEmbed } = require('discord.js');
const { interactionMsg } = require('../../function/functions');
const Discord = require("discord.js");

module.exports = {
    name: 'tsundere', //user: not required 
    run: async(client,args,guild)=>{
        const me = await guild.members.fetch(client.user.id);
        if(!me.permissionsIn(args.channel_id).has(["SEND_MESSAGES", "EMBED_LINKS"])) return;
        
        const author = await client.users.fetch(args.member.user.id);

        let blabla = `${author.username}:`;
        var member;
        if(args.data.options) {
            member = await guild.members.fetch(args.data.options[0].value);
            if(member.id === author.id) {
                const embed = new MessageEmbed()
                .setDescription(`Wait you can\'t do that`);
                return interactionMsg(client, args, embed,author,[author.id])
            }
            blabla = `${author.username} to ${member.user.username}:`;
        }
        const rtxt = [
            {number: 1, text:`Hmpft, I didn't want to come with you, I just had nothing better to do!`},
            {number: 2, text:`You bought me something.....hmft just leave it over there *says it with a smile on her face*`},
            {number: 3, text:`Hmpft, you didn't have to help, I could've done it by myself`},
            {number: 4, text:`God, You are so stupid`},
            {number: 5, text:`You better be grateful!!`},
            {number: 6, text:`*Gives a meal* and says \`I just happened to make some extra\``},
            {number: 7, text:`it's not like i like doing this with you, I only have you around for entertainment purposes only`},
            {number: 8, text:`Fine be that way, I didn't want you here anyway`},
            {number: 9, text:`i-i-i-its not like I like you or anything! B-baka!`}
        ];

        let rtext = rtxt[Math.floor(Math.random() * rtxt.length)];

        const embed = new Discord.MessageEmbed()
        .addField(`${blabla}`, `${rtext.text}`)
        .setFooter(`<= Tsundere, ID: ${rtext.number}`, author.displayAvatarURL());
        if(!member) {
            interactionMsg(client, args, embed,null,[])
        } else {
            interactionMsg(client, args, embed,`<@!${member.user.id}>`,{"users": [member.user.id]})
        }
    }
}