const Discord = require("discord.js");


module.exports = {
    name: "help",
    category: "info",
    description: "Help Command",
    run: async (client, message, args) => {
        const embed = new Discord.MessageEmbed()
            .setTitle(`Server: ${message.guild.name}`)
            .addField(`Dashboard (*BETA*)`, `[Click Here](https://dashboard.menhera-chan.in/)`)
            .addField(`Command List`, `[Click Here](https://www.menhera-chan.in/commands)`)
            .addField(`Support`, `[Click Here](https://www.menhera-chan.in/support)`)
        message.channel.send(embed);
    }
}