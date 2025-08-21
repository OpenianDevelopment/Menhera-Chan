const { EmbedBuilder } = require('discord.js');
const globalFunc = require('../../function/dbfunctions');

module.exports = {
    name: 'vote',
    description: 'votes for our bot',
    category:'general',
    args: false,
    run:async(client,message,args)=>{
        const embed = new EmbedBuilder()
        .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL(), url: 'https://menhera-chan.in/' })
        .setDescription('You can vote every 12 hours at https://top.gg/bot/731143954032230453')
        return message.reply({ embeds: [embed] })
    }
}