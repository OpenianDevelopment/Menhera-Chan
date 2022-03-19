const { checkData, bl } = require('../../function/dbfunctions')
module.exports = {
    name: 'guildclean',
    description: 'clean guild db',
    category: 'dev',
    args: false,
    run: async (client, message, args) => {
        var data = await bl(message.author.id, `dev`);
        if (data == null) return message.channel.send(`You're not a developer`);

        var guilds = [];
        client.guilds.cache.forEach(element => {
            guilds.push(element.id)
        });
        var response = await checkData(guilds)
        message.channel.send(`Deleted ${response} guilds`)
    }
}