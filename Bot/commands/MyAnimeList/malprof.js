const jikan = require('jikanjs')
const Discord = require('discord.js')
const { addMalProfile, getMalProfile } = require('../../function/dbfunctions')
const axios = require('axios')
module.exports = {
    name: 'mprofile',
    category: 'MyAnimeList',
    description: 'To add/get MAL Profile',
    usage: '< username >',
    args: true,
    run: async (client, message, args) => {
        var username = args[0];

        //* deleted code about getting user from db

        var result = await axios.get(`https://api.jikan.moe/v3/user/${username}`).catch(err => {
            return;
        })
        if (!result) return message.channel.send('User Not Found on MAL');
        if (result.status != 200) return message.channel.send('User Not Found on MAL')
        const profile = new Discord.MessageEmbed()
            .setTitle(`${username}'s Profile`)
            .setURL(result.data.url)
            .setThumbnail(result.data.image_url)
            .addField(`<:MenheraWave:738775873217495160> Anime`, result.data.anime_stats.total_entries, true)
            .addField(`👀 Watching`, result.data.anime_stats.watching, true)
            .addField(`📊 Mean Score`, result.data.anime_stats.mean_score, true)
            .addField(`<:KomiBaka:743366396590948444> Manga`, result.data.manga_stats.total_entries, true)
            .addField(`👓 Reading`, result.data.manga_stats.reading, true)
            .addField(`📊 Mean Score`, result.data.manga_stats.mean_score, true)
            .addField(`🍰 Birthday`, new Date(result.data.birthday).toDateString(), true)
            .addField(`Joined`, new Date(result.data.joined).toDateString(), true)


        message.channel.send(profile)





    }
}