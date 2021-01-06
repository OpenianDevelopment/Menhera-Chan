const Discord = require('discord.js');
const globalFunc = require('../../function/dbfunctions');

module.exports = {
    name: 'rpdrop',
    description: 'to remove rp pics',
    usage: '<RP_ID>',
    category:'dev',
    args: true,
    run:async(client,message,args)=>{
        var data = await globalFunc.bl(message.author.id,"dev")
        if(data == null) return message.channel.send(`You're not a developer`)
        await globalFunc.RpDROP(args[0])
        return message.channel.send(`removed from db`)
    }
}