const Discord = require('discord.js')
const fetch = require('node-fetch');
const { interactionMsg } = require('../../function/functions')

module.exports = {
    name: 'menhera',
    category: 'general',
    description: 'Get Menhera Images from r/menhera',
    run: async(client,args)=>{     
        fetch('https://www.reddit.com/r/menhera/.json').then(res=>res.json()).then(body=>{
            const post = body.data.children.filter(b=>b.data.link_flair_text==='Menhera-chan');
            const random = Math.floor((Math.random() * post.length) + 1);
            const menhera= post[random-1];
            const embed = new Discord.MessageEmbed()
                            .setTitle(menhera.data.title)
                            .setColor('PINK')
                            .setURL(`https://www.reddit.com${menhera.data.permalink}`)
                            .setDescription(`Post by: u/${menhera.data.author}`)
                            .setImage(menhera.data.url)

            interactionMsg(client,args,embed)
        })                 
    }
}