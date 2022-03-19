const Discord = require('discord.js');
const jikan = require('jikanjs')
module.exports = {
    name: 'recommendations',
    description: 'To get recommendation based on anime',
    category: 'MyAnimeList',
    aliases: ["rec"],
    args: true,
    usage: '<mal ID>',
    run: async (client, message, args) => {
        if (isNaN(args[0])) return message.channel.send('Please Provide Correct MAL Anime ID')
        var anime_id = parseInt(args[0])
        console.log(anime_id)
        var result = []
        var page = 1;

        await jikan.loadAnime(anime_id, 'recommendations').then(response => {
            response.recommendations.forEach(anime => {
                var embed = new Discord.MessageEmbed()
                    .setTitle(anime.title)
                    .setThumbnail(anime.image_url)
                    .addField('MAL ID: ', anime.mal_id)
                    .addField('URL: ', anime.url)
                    .addField('Recommendation URL: ', anime.recommendation_url)
                    .setFooter('Menhera Chan is Kawaii || www.menhera-chan.in')
                result.push(embed);

            })
        })
        message.channel.send(result[page - 1]).then(msg => {
            msg.react('740904210484166727').then(r => {
                msg.react('740904210597543976')

                const backwardsFilter = (reaction, user) => reaction.emoji.name === 'pageup' && user.id === message.author.id;
                const forwardFilter = (reaction, user) => reaction.emoji.name === 'pagedown' && user.id === message.author.id;
                const backwards = msg.createReactionCollector(backwardsFilter, { time: 60000 * 5 });
                const forward = msg.createReactionCollector(forwardFilter, { time: 60000 * 5 });
                backwards.on('collect', r => {
                    if (page === 1) return;
                    page--;
                    msg.edit(result[page]);
                    r.users.remove(message.author).catch(err => {
                        return;
                    })
                })
                forward.on('collect', r => {
                    if (page === result.length) return;
                    page++;
                    msg.edit(result[page]);
                    r.users.remove(message.author).catch(err => {
                        return;
                    })
                })

            })
        })

    }
}