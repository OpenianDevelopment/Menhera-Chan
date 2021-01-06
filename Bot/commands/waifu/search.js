const { MessageEmbed } = require('discord.js');
const { getWaifu } = require('../../function/dbfunctions(2)')
module.exports = {
    name: 'search',
    aliases: ["find"],
    description: 'Search your waifu in our DB',
    usage: '[waifu]',
    args: true,
    run: async(client,message,args)=>{
        const name = args.join(' ')
        const waifu = await getWaifu(name);
        var result = [];
        var page = 0
        
        if(!waifu.length) return message.channel.send('Waifu not found!');
        waifu.forEach(w=>{
            const embed = new MessageEmbed()
                                .setColor('#7289da')
                                .setTitle(`NAME: ${w.name.toUpperCase()}`)
            let str = `**ID:** ${w.id}\n**Price:** ${w.cost}\n`;
            if(w.anime != null){
                str+=`**Anime:** ${w.anime}\n`
            }
            if(w.wish){
                str+=`${w.wish} user want ${w.name}`
            }
            embed.setDescription(str);
            embed.setImage(w.image);
            result.push(embed);            
        })

        message.channel.send(result[page]).then(msg=>{
            msg.react('740904210484166727').then(r=>{
                msg.react('740904210597543976')

                const backwardsFilter = (reaction,user) => reaction.emoji.name === 'pageup' && user.id === message.author.id;
                const forwardFilter = (reaction,user) => reaction.emoji.name === 'pagedown' && user.id === message.author.id;                
                const backwards = msg.createReactionCollector(backwardsFilter, {time: 60000*5});
                const forward = msg.createReactionCollector(forwardFilter, {time: 60000*5});
                backwards.on('collect',r=>{
                    if(page===0) return;
                    page--;
                   
                    msg.edit(result[page]);
                    r.users.remove(message.author).catch(err=>{
                        return;
                    })
                })
                forward.on('collect', r=>{
                    if(page===result.length-1) return;
                    page++;
                    
                    msg.edit(result[page]);
                    r.users.remove(message.author).catch(err=>{
                        return;
                    })
                })

            })
        })
    }
}