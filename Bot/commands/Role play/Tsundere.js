const Discord = require("discord.js")
module.exports = {
    name: 'tsundere',
    description: 'Gives a \"Tsundere\" Quote',
    usage: '[user]',
    category:'Role play',
    run:async(client,message,args,con,rcon)=> {
        const member = message.mentions.members.first();
        let blabla = `${message.author.username}:`
        if(member) {
        blabla = `${message.author.username} to ${member.user.username}:`;
        }
        const rtxt = [
            `Hmpft, I didn't want to come with you, I just had nothing better to do!`, 
            `You bought me something.....hmft just leave it over there *says it with a smile on her face*`,
            `Hmpft, you didn't have to help, I could've done it by myself`,
            `God, You are so stupid`,
            `You better be grateful!!`,
            `*Gives you meal* and says \`I just happened to make some extra\``,
            `it's not like i like doing this with you, I only have you around for entertainment purposes only`,
            `Fine be that way, I didn't want you here anyway`,
            `i-i-i-its not like I like you or anything! B-baka!`
        ];

        let rtext = rtxt[Math.floor(Math.random() * rtxt.length)];
        if(member) {
            if(member.id === message.author.id) 
            return message.reply(`Wait you can\'t do that`);
        }

        let embed = new Discord.MessageEmbed()
        .addField(`${blabla}`, `${rtext}`)
        .setFooter(`<= Tsundere`, message.author.displayAvatarURL());
        return message.channel.send(embed);
    }
}