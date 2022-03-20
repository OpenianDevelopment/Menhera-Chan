const Discord = require('discord.js');;
const globalFunc = require('../../function/dbfunctions');
const DBL = require("dblapi.js");

module.exports = {
    name: 'vote',
    description: 'votes for our bot',
    category:'general',
    args: false,
    run:async(client,message,args)=>{
        const embed = new Discord.MessageEmbed()
        .setAuthor(client.user.username, client.user.displayAvatarURL(), 'https://menhera-chan.in/')
        .setDescription('You can vote every 12 hours at https://top.gg/bot/731143954032230453')
        return message.reply(embed)
    }
}