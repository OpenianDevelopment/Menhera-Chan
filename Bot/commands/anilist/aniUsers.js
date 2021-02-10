const Discord = require('discord.js');
const fetch = require('cross-fetch');
const {embedPage,anidata} = require('../../function/functions')
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
   var animedata = await anidata(url,options)
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
    
            embedPage(message,embeds)
        }
    }