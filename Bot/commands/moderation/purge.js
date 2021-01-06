const Discord = require('discord.js')
const { sendModLog } = require('../../function/functions')
module.exports = {
    name: 'purge',
    category:'moderation',
    description: 'To delete messages',
    permission: 'MANAGE_MESSAGES',
    botPermission: 'MANAGE_MESSAGES',
    usage: '<num>',
    args: true,
    run: async(client,message,args)=>{
        if(isNaN(args[0])) return message.channel.send("Provide number of messages")
        await message.delete();
        if(parseInt(args[0])>100||parseInt(args[0])<1) return message.channel.send(`${message.author.username} Chan, Please provide a number between 1 to 100`)
        const fetched = await message.channel.messages.fetch({limit: args[0]})
        message.channel.bulkDelete(fetched, true).catch(err=>{
            if(err) return message.channel.send('You can\'t delete messages that are 14 day old')
        })
        sendModLog(message,message.guild.botSetting.logchannel,`Purge`,message.channel.id,null,null,args[0],client)
    }
}