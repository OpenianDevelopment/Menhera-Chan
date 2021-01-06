const Discord = require('discord.js');
let moment = require("moment");
require("moment-duration-format");

module.exports = {
    name: 'uptime',
    aliases: [],
    description: 'For the bot\'s up-time',
    category:'info',
    run:(client,message,args,con,rcon)=>{
        let d = moment.duration(client.uptime).format(`d [Day], h [Hour], m [Minutes], s [Seconds]`);
        message.reply(`Hi i'm now online for \`\`\`nim\n${d}\`\`\``)
    }
} 