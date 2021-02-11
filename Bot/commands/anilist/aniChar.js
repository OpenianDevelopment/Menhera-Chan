const Discord = require('discord.js');
const fetch = require('cross-fetch');
const {embedPage,anidata} = require('../../function/functions')
module.exports = {
    name: 'anichar',
    description: 'to look up characters',
    usage: '<character name>',
    args: true,
    category:'anilist',
    run:async(client,message,args)=>{
        let name = args.slice(0).join(' ');
var query = `
query ($id: Int,$search: String) {
  Character(id: $id, search: $search) {
    name {
      full
    }
    image {
      large
    }
    description
    anime: media(page: 1, perPage: 5, type: ANIME) {
      nodes {
        title {
          romaji
        }
      }
    }
    manga: media(page: 1, perPage: 5, type: MANGA) {
      nodes {
        title {
          romaji
        }
      }
    }
  }
}
`;

var variables = {
    search: name,
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

var AnimeData = await anidata(url,options)

    if(AnimeData == undefined) return message.channel.send(`Could not find anything`)
    var data = AnimeData.data.Character
    console.log(data)
    var anime = ""
    var manga = ""
    await data.anime.nodes.forEach(element => {
        anime = element.title.romaji +` \n`+  anime
    });
    await data.manga.nodes.forEach(element => {
        manga = element.title.romaji+` \n`+manga
    });
    const embed = new Discord.MessageEmbed()
    .setTitle(data.name.full)
    .setImage(data.image.large)
    .addField("Anime",anime)
    .addField("Manga",manga)
    if(data.description.length < 2048){
      embed.setDescription(data.description,{split: true})
      message.channel.send(embed)
    }else{
      message.channel.send(embed)
      message.channel.send(data.description,{split: true})
    }
    }
}