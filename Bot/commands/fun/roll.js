const Discord = require('discord.js')
module.exports = {
    name: 'roll',
    description: 'Roll a dice of any size',
    category: 'fun',
    usage: '[num]',
    run: (client, message, args) => {
        var num = 6;
        if (args != "") {
            if (!isNaN(args)) {
                num = parseInt(args);
            } else {
                message.channel.send(`"${args}" Is Not A Numeber`)
                return
            }
            if (num > 100) return message.channel.send(`"${args}" Is too large of a Number \n The biggest roll you can do is 100`)
            if (num < 2) return message.channel.send(`"${args}" Is too small of a Number \n The smallest roll you can do is 2`)
        }

        const embed = new EmbedBuilder()
            .setTitle('🎲Die Roll🎲')
            .setThumbnail("https://cdn.discordapp.com/attachments/715192953957515346/731653756835463178/ElatedImpartialArmadillo-max-1mb.gif")
            .setDescription(`You rolled a ${num} sided die`)
            .addFields({ name: `You got:`, value: `${(Math.floor(Math.random() * num) + 1)}` })
            .setFooter({ text: `You can roll any number just put a number at the end of roll` })
        message.channel.send({ embeds: [embed] });

    }
}
