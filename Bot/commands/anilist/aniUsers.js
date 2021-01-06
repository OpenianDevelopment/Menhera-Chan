const Discord = require('discord.js');
const fetch = require('cross-fetch');
module.exports = {
    name: 'aniusers',
    description: 'to look up many users',
    usage: '<Anilist Account Name>',
    args: true,
    category:'anilist',
    run:async(client,message,args)=>{
        let name = args.slice(0).join(' ');
        var query = `
        query ($id: Int, $page: Int, $perPage: Int, $search: String, $sort: [UserSort]) {
            Page(page: $page, perPage: $perPage) {
              pageInfo {
                total
                currentPage
                lastPage
                hasNextPage
                perPage
              }
              users(id: $id, search: $search, sort: $sort) {
                id
              name
              updatedAt
              avatar {
                large
                medium
              }
              about
              statistics {
                anime {
                  count
                  episodesWatched
                  minutesWatched
                }
                manga {
                  count
                  volumesRead
                  chaptersRead
                }
              }
              unreadNotificationCount
              siteUrl
              }
            }
          }
        `; 
        var variables = {
            search: name,
            sort: "SEARCH_MATCH",
            page: 1,
            perPage: 25
        };
        var url = 'https://graphql.anilist.co',
        options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify({
            query: query,
            variables: variables
        })
    };
   var animedata = await fetch(url, options)
        .then(handleResponse)
        .catch(handleError);
        if(animedata== undefined)return message.channel.send("```If you see this message contact devs```")
        var data = animedata.data.Page.users
        if(data == undefined)return message.channel.send(`Search Error`)
        if(data.length == 0)return message.channel.send(`Could not find anything`)
        
            var page=0;
            var embeds=[];
            data.forEach(element => {
                var time = new Date(element.updatedAt*1000)
                const embed = new Discord.MessageEmbed()
                .setTitle(element.name)
                .setThumbnail(element.avatar.large)
                .addField("ID:",element.id,true)
                .addField("Anime Count:",element.statistics.anime.count,true)
                .addField("Episode Count:",element.statistics.anime.episodesWatched,true)
                .addField("Anime Watch Time:",element.statistics.anime.minutesWatched/60+" Hours",true)
                .addField("Manga Read:",element.statistics.manga.count,true)
                .addField("Chapters Read:",element.statistics.manga.chaptersRead,true)
                .addField("Volumes Read:",element.statistics.manga.volumesRead,true)
                .addField("Last Updated",`${time.getMonth()}/${time.getDay()}/${time.getFullYear()}`,true)
                if(element.unreadNotificationCount != null){
                    embed.addField("Unread Notification:",element.unreadNotificationCount,true)
                }else{
                    embed.addField("Unread Notification:",0,true) 
                }
                if(element.about != null){
                    embed.setDescription(element.about)
                }else{
                    embed.setDescription("This user has nothing to say about themself")
                }
                embed.addField(`URL:`,element.siteUrl,true)
            embeds.push(embed)
            });
            
           botmsg = await message.channel.send(embeds[page])
            await botmsg.react(`⬅️`)
            await botmsg.react(`➡️`)
    
            rewait(message,botmsg,embeds,page)
        }
    }
    function rewait(message,botmsg,embeds,page){
        test = 0
        botmsg.awaitReactions((reaction, user)=> (reaction.emoji.name === `⬅️`||reaction.emoji.name === `➡️`)&&user.id === message.author.id,{max :1})
        .then(r=>{
            re0 = botmsg.reactions.cache.filter(reaction => reaction.users.cache.has(message.author.id));
            for (const re1 of re0.values()) {
                re1.users.remove(message.author.id);
            }
            emote = r.map(r=>r.emoji.name).toString()
            if(emote === `⬅️`){
                if(page-1 >= 0){
                page--
                embeds[page].setFooter(`Page ${page+1} of ${embeds.length} || Menhera Chan is Kawaii || www.menhera-chan.in`)
                botmsg.edit(embeds[page])
                }
            }
            if(emote === `➡️`){
                if(page+1 <= embeds.length-1){
                page++
                embeds[page].setFooter(`Page ${page+1} of ${embeds.length} || Menhera Chan is Kawaii || www.menhera-chan.in`)
                botmsg.edit(embeds[page])
                }
            }
            if(test != 1)return rewait(message,botmsg,embeds,page)
        })
        setTimeout(function(){test = 1},120000)
    }
function handleResponse(response) {
    return response.json().then(function (json) {
        return response.ok ? json : Promise.reject(json);
    });
}
function handleError(error) {
    console.error(error);
}