const Discord = require('discord.js');
const fetch = require('cross-fetch');
const {embedPage,anidata} = require('../../function/functions')
module.exports = {
    name: 'aniuser',
    description: 'to look up a user',
    usage: '<Anilist Account Name>',
    args: true,
    category:'anilist',
    run:async(client,message,args)=>{
        let name = args.slice(0).join(' ');
        var query = `
        query ($id: Int, $search: String) {
            User(id: $id, search: $search) {
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
        `; 
        var variables = {
            search: name
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
        if(animedata== undefined)return message.channel.send("User Not Found")
        var data = animedata.data.User
        if(data == undefined)return message.channel.send(`Search Error`)

        var time = new Date(data.updatedAt*1000)
            const embed = new Discord.MessageEmbed()
            .setTitle(data.name)
            .setThumbnail(data.avatar.large)
            .addField("ID:",data.id,true)
            .addField("Anime Count:",data.statistics.anime.count,true)
            .addField("Episode Count:",data.statistics.anime.episodesWatched,true)
            .addField("Anime Watch Time:",data.statistics.anime.minutesWatched/60+" Hours",true)
            .addField("Manga Read:",data.statistics.manga.count,true)
            .addField("Chapters Read:",data.statistics.manga.chaptersRead,true)
            .addField("Volumes Read:",data.statistics.manga.volumesRead,true)
            .addField("Last Updated",`${time.getMonth()}/${time.getDay()}/${time.getFullYear()}`,true)
            if(data.unreadNotificationCount != null){
                embed.addField("Unread Notification:",data.unreadNotificationCount,true)
            }else{
                embed.addField("Unread Notification:",0,true) 
            }
            if(data.about != null){
                embed.setDescription(data.about)
            }else{
                embed.setDescription("This user has nothing to say about themself")
            }
            embed.addField(`URL:`,data.siteUrl,)
            
           message.channel.send(embed)
        }
    }