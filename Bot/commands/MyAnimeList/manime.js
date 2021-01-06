const Discord = require('discord.js');
const axios = require('axios')
module.exports = {
    name: 'manime',
    description: 'To search anime on MAL',
    category: 'MyAnimeList',
    args: true,
    usage: '<anime name>',
    run: async(client,message,args)=>{
        
        var query = args.join(' ');
        if(query.length<3) return message.channel.send('Please Search with minimum 3 character')
        var result = []
        var page = 0;
        
        var response = await axios.get(`https://api.jikan.moe/v3/search/anime?q=${query}`)
        
            var embed
            if(response.data.results===null) return message.channel.send('No Search Result!')
            var totalPage = response.data.results.length;
            
            response.data.results.forEach(async(anime,i)=>{
                
                
               try{
                if(anime.rated ==='Rx' && !message.channel.nsfw){
                    embed = new Discord.MessageEmbed()
                            .setTitle('NSFW Title')
                            .setThumbnail('https://techcrunch.com/wp-content/uploads/2017/04/tumblr-nsfw.png?w=711',200,200)
                            .setDescription('This Anime Can be viewed in NFSW Channel. Please move to next Page')
                            .setFooter(`${i+1} of ${totalPage} | MyAnimeList | www.menhera-chan.in`)
                            
                }
                else{
                    
                    embed = new Discord.MessageEmbed()
                            .setTitle(anime.title)
                            .setThumbnail(anime.image_url)
                            .addField('Episodes: ',anime.episodes)
                            .addField('MAL ID: ',anime.mal_id)
                            .addField('URL: ', anime.url)
                            .setDescription(`**Synopsis**: ${anime.synopsis}`)
                            .setFooter(`${i+1} of ${totalPage} | MyAnimeList | www.menhera-chan.in`)
                   
                }
                result.push(embed);

               }
               catch{

               }
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