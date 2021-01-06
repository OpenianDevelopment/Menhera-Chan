const Discord = require('discord.js')

module.exports = {
    name: 'ping',
    description: 'show message ping',
    category:'general',
    run:async(client,message,args,con,rcon)=>{
        let pingmsg = await message.channel.send(`<a:reload:732575989137276998>`);
        let ping = `Message Ping: ${Math.floor(pingmsg.createdTimestamp -  message.createdTimestamp)} ms\nDiscord Latency: ${Math.round(client.ws.ping)} ms`
        pingmsg.edit(`\`\`\`js\n${ping}\`\`\``)
    }
}