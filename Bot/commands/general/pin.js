const Discord = require('discord.js')
module.exports = {
    name: 'pin',
    category: 'general',
    description: 'To pin the last message',
    permission: 'MANAGE_MESSAGES',
    botPermission: 'MANAGE_MESSAGES',
    run: async (client, message, args) => {

        await message.delete();
        message.channel.messages.fetch({ limit: 1 }).then(msg => {
            const msg1 = msg.first();
            msg1.pin();
        })
    }
}