const Discord = require("discord.js");


module.exports = {
    name: "list",
    category: "wiafu",
    description: "List of wiafu/husbando",
    run: async (client, message, args) => {
        const embed = new Discord.MessageEmbed()
                            .setTitle(`Waifu/Husbando List`)
                            .setDescription(`[Click Here](https://www.menhera-chan.in/characters/)`)
                            .setFooter("Or search with mc!search (name)")
        message.channel.send(embed);
    }
}