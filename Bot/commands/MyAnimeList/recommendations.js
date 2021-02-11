const Discord = require('discord.js');
const jikan = require('jikanjs')
const { embedPage } = require('../../function/functions');
module.exports = {
    name: 'recommendations',
    description: 'To get recommendation based on anime',
    category: 'MyAnimeList',
    aliases: ["rec"],
    args: true,
    usage: '<mal ID>',
    run: async(client,message,args)=>{
        if(isNaN(args[0])) return message.channel.send('Please Provide Correct MAL Anime ID')
        var anime_id = parseInt(args[0])
        console.log(anime_id)
        var result = []
        var page = 1;
        
        await jikan.loadAnime(anime_id,'recommendations').then(response=>{
            response.recommendations.forEach(anime=>{
                var embed = new Discord.MessageEmbed()
                            .setTitle(anime.title)
                            .setThumbnail(anime.image_url)
                            .addField('MAL ID: ',anime.mal_id)
                            .addField('URL: ', anime.url)
                            .addField('Recommendation URL: ', anime.recommendation_url)
                            .setFooter('Menhera Chan is Kawaii || www.menhera-chan.in')
                result.push(embed);
                
            })
        })
        embedPage(message,result)
       
    }
}