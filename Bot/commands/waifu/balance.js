const { MessageEmbed } = require('discord.js');

const {getUserEarnings} = require('../../function/dbfunctions(2)');
module.exports = {
    name: 'balance',
    aliases: ["bal"],
    category: 'waifu',
    description: 'Check your balance',
    run: async (client,message,args)=>{
        const member = message.mentions.members.first() || message.member;
        const user = await getUserEarnings(member);
        if(!user) return message.channel.send('User Data not found');
        console.log(user)
        const embed = new MessageEmbed()
                            .setTitle(`${member.user.username}'s Balance`)
                            .addField(`Coins: `,`${user.balance}`)
        message.channel.send(embed);
    }
}