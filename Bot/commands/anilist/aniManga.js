const Discord = require('discord.js');
const fetch = require('cross-fetch');
module.exports = {
    name: 'animanga',
    description: 'to look up manga',
    usage: '<Manga Title>',
    args: true,
    category:'anilist',
    run:async(client,message,args)=>{
        let name = args.slice(0).join(' ');
        var query = `
        query ($id: Int, $page: Int, $perPage: Int, $search: String) {
            Page (page: $page, perPage: $perPage) {
              pageInfo {
                total
                currentPage
                lastPage
                hasNextPage
                perPage
              }
              media (id: $id, search: $search, type: MANGA) {
                id
                title {
                  romaji
                  english
                }
                description
                coverImage{
                  extraLarge
                }
                startDate{
                  year
                  month
                  day  
                }
                format
                status
                chapters
                volumes
                isAdult
                averageScore
                source
              }
            }
          }
        `; 
        var variables = {
            search: name,
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
        var data = animedata.data.Page.media
        if(data.length == 0)return message.channel.send(`Could not find anything`)
            var page=0;
            var embeds=[];
            data.forEach(element => {
                if(element.isAdult == true){
                    const embed = new Discord.MessageEmbed()
                    .setTitle("Adult Content")
                    .setDescription("Feature to see 18+ content coming very soon")
                    embeds.push(embed)
                    return
                }
                var newDescription;
                if(element.description !=null){
            newDescription = element.description.replace(/(<([^>]+)>)/gi, "");
                }else{
                    newDescription = "No Description"
                }
            const embed = new Discord.MessageEmbed()
            .setTitle(element.title.romaji)
            .setThumbnail(element.coverImage.extraLarge)
            .setDescription(element.title.english+`\n`+`\n`+newDescription)
            .addField(`ID:`,element.id,true)
            if(element.status != "NOT_YET_RELEASED"){
            embed.addField(`Average Score:`,element.averageScore+`%`,true)
            embed.addField(`Aired:`,`(${element.startDate.day}/${element.startDate.month}/${element.startDate.year})`,true)
            }
            embed.addField(`Status:`,element.status,true)
            if(element.status != "NOT_YET_RELEASED"){
                embed.addField(`Volumes:`,element.volumes,true)
                embed.addField(`Chapters:`,element.chapters,true)
            }
            embed.addField(`Format:`,element.format,true)
            embed.addField(`source:`,element.source,true)
            embed.addField(`18+:`,element.isAdult,true)
            embed.addField(`Link:`,`https://anilist.co/manga/${element.id}/`,true)
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