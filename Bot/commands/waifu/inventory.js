const { MessageEmbed } = require('discord.js');
const { getUserEarnings } = require('../../function/dbfunctions(2)');
module.exports = {
    name: 'inventory',
    aliases: ["inv"],
    category: 'waifu',
    description: 'Get users Inventory',
    run: async (client,message,args)=>{
        const member = message.mentions.members.first() || message.member
        const user = await getUserEarnings(member);
        console.log(user)
        if(!user) return message.channel.send('User data not found');
        if(!args.length || parseInt(args[0])===0) args[0] = 1;
        
        if(isNaN(args)) return message.channel.send('Please provide a page number');
        const j = parseInt(parseInt(args[0])*10);
        const i = j-10;
        
        let str = `Items owned - ${user.characters.length}\n`
        for(var k = i; k<j;k++){
            if(k<user.characters.length){
                str+=`**${user.characters[k].characterId}**. ${user.characters[k].name.toUpperCase()} - ${user.characters[k].cost}\n`
            }
            
            console.log(str)
        }
        const embed = new MessageEmbed()
                            .setTitle(`${member.user.username}'s Inventory`)
                            .setDescription(str)
                            .setColor('#7289da')


        message.channel.send(embed);


    }

}