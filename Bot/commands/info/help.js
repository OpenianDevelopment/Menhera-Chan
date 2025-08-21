const { EmbedBuilder } = require("discord.js");


module.exports = {
    name: "help",
    category: "info",
    description: "Help Command",
    run: async (client, message, args) => {
        const embed = new EmbedBuilder()
            .setTitle(`Server: ${message.guild.name}`)
            .addFields(
                { name: `Dashboard (*BETA*)`, value: `[Click Here](https://dashboard.menhera-chan.in/)`, inline: false },
                { name: `Command List`, value: `[Click Here](https://www.menhera-chan.in/commands)`, inline: false },
                { name: `Support`, value: `[Click Here](https://www.menhera-chan.in/support)`, inline: false }
            )
        message.channel.send({ embeds: [embed] });
    }
}