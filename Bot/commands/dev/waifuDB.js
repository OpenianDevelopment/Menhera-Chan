const Discord = require('discord.js');const dbfunctions = require('../../function/dbfunctions');
;
const globalFunc = require('../../function/dbfunctions');
const {updateWaifu} = require('../../function/dbfunctions(2)')

module.exports = {
    name: 'waifudb',
    description: 'waifu db',
    category:'dev',
    usage: '{"id":<id>"name":"<name>","anime":"<anime>","image":"<image>","gender":"<gender>","cost":"<cost>"}   [side note all but id can be left blank]',
    args: true,
    run:async(client,message,args)=>{
        var data = await globalFunc.bl(message.author.id,`dev`);
        if(data == null) return message.channel.send(`You're not a developer`);
        var text = message.content.split("waifudb ")[1]
        try{
        var data = JSON.parse(text)
        }catch{
            return message.channel.send("Invalid format")
        }
        if(data.id == undefined)return(message.channel.send("no ID"))
        if(data.name == undefined){data.name = null}
        if(data.anime == undefined){data.anime = null}
        if(data.gender == undefined){data.gender = null}
        if(data.cost == undefined){data.cost = null}
        if(data.image == undefined){data.image = null}
        var stats = await updateWaifu(data.id,data.name,data.image,data.gender,data.anime,data.cost)
        if(stats == false)return message.channel.send("bad argument or an error has occured when updating")
        message.channel.send("waifu updated")
    }
}