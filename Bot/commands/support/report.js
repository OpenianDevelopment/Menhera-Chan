const { EmbedBuilder } = require('discord.js');
const { bl } = require(`../../function/dbfunctions`)
module.exports = {
    name: 'report',
    aliases: ["bugreport"],
    description: 'reports issue with the bot',
    category: 'support',
    args: false,
    run: async (client, message, args) => {
        var userban = await bl(message.author.id, 'user')
        var guildban = await bl(message.guild.id, 'guild')
        if (userban != null) return message.channel.send(`you have been blacklisted from using this command`)
        if (guildban != null) return message.channel.send(`you have been blacklisted from using this command`)
        const embed = new EmbedBuilder()
            .setTitle('Bug Report')
            .setDescription("You you like to report a bug?(Yes/No)")
        var botmsg = await message.channel.send({ embeds: [embed] })
        
        const filter = response => response.author.id === message.author.id;
        const collector = message.channel.createMessageCollector({ filter, max: 1, time: 60000 });
        
        collector.on('collect', async (answer) => {
            const agree = answer.content;
            await answer.delete().catch(() => {});
            
            if (agree.toLowerCase() != "yes") return botmsg.edit({ content: "The process has been terminated", embeds: [] });
            
            embededit(botmsg, "Please Describe the bug");
            
            const collector2 = message.channel.createMessageCollector({ filter, max: 1, time: 60000 });
            collector2.on('collect', async (answer1) => {
                const reply = answer1.content;
                await answer1.delete().catch(() => {});
                embededit(botmsg, "Thank you for reporting" + `\n` + `Your Report: ${reply}`);

                const embed1 = new EmbedBuilder()
                    .setTitle('Incoming Bug Report')
                    .setDescription(`${reply}`)
                    .addFields({ name: `Author:`, value: `${message.author} ( \`${message.author.id}\` )` })

                const guild = client.guilds.cache.get("735899211677041099");
                if (guild) {
                    const channel = guild.channels.cache.get("735904379303100442");
                    if (channel) {
                        channel.send({ embeds: [embed1] });
                    }
                }
            });
        });
    }
}
function embededit(botmsg, info) {
    const embed = new EmbedBuilder()
        .setTitle('Bug Report')
        .setDescription(`${info}`)

    botmsg.edit({ embeds: [embed] });
}