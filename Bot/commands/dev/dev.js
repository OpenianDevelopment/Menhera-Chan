const Discord = require('discord.js');
const globalFunc = require('../../function/dbfunctions');
const stats = require('pc-stats')

module.exports = {
    name: 'dev',
    description: 'For dev commands',
    category: 'dev',
    args: false,
    run: async (client, message, args) => {
        var data = await globalFunc.bl(message.author.id, `dev`);
        if (data == null) return message.channel.send(`You're not a developer`);

        const commands = (category) => {
            return client.commands
                .filter(cmd => cmd.category === category)
                .map(cmd => `**||\`${cmd.name}\`||** ~ ${cmd.description}`)
                .join("\n")

        }
        var size = client.guilds.cache.size;

        //	        const guildsShard = await client.shard.fetchClientValues('guilds.cache.size');
        //      	size = guildsShard.reduce((acc, guildCount) => acc + guildCount, 0);

        var stat;
        var total = 0;
        await stats().then((statistics) => {
            stat = statistics
        }).catch((err) => {
            console.log(err)
        })
        for (var i = 0; i < stat.cpu.threads.length; i++) {
            total = stat.cpu.threads[i].usage + total
        }
        total = total / stat.cpu.threads.length

        const embed = new Discord.MessageEmbed()
            .setColor("blue")
            .addField(`Developers commands`, commands('dev'))
            .addField(`Bot stats`, `Guilds size: **${size}**
            Users size: **${client.users.cache.size}**
            CPU: **${stat.cpu.name}**
            CPU Usage: **${total.toFixed(2)}%**
            Ram Usage in GB: **${(process.memoryUsage().heapUsed / 1024 / 1024 / 1024).toFixed(2)} GB**
            Ram Usage in MB: **${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB**
            Total ram: **${stat.ram.total} GB**
            *not rem <:KEKW:739944199096369184>*`); //a lame joke
        //need to get changed if shards added

        return message.channel.send(embed);
    }
} 
