const { MessageEmbed } = require('discord.js');
const {getProduct, AddCharacters, getUserEarnings} = require('../../function/dbfunctions(2)');
module.exports = {
    name: 'buy',
    description: 'To buy a charcters',
    usage: 'waifu',
    category: 'waifu',
    args: true,
    run: async(client, message, args)=>{
        let id = args[0];
        if(isNaN(id)) return message.channel.send('Please provide a correct ID');
        id = parseInt(id);
        const waifu = await getProduct(id);
        const user = await getUserEarnings(message.author)
        if(!user) return message.channel.send('User Data Don\'t exist')
        if(!waifu) return message.channel.send('Please provide a correct ID');
        const check = user.characters.filter(r=>r.characterId === id.toString())
        if(check.length) return message.channel.send('You already own this characters')
        if(parseInt(waifu.cost) > user.balance) return message.channel.send('Insufficient Balance');
        console.log(user.balance)
        const newBal = parseInt(parseInt(user.balance) - parseInt(waifu.cost));
        console.log(newBal)
        const newWaifu = user.characters;
        newWaifu.push({
            characterId: id,
            name: waifu.name,
            cost: waifu.cost
        })
        await AddCharacters(message.author,newWaifu,newBal)

        
        const embed = new MessageEmbed()
                            .setTitle('Purchase successful')
                            .setDescription(`${user.username} have successfully bought **${waifu.name.toUpperCase()}**`)
                            .addField('Remanining Balance:',newBal)
                            .setThumbnail(waifu.image)
                            .setFooter('https://menhera-chan.in/ || Menhera Chan')

        message.channel.send(embed);

    } 
}