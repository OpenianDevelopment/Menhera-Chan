const { MessageEmbed } = require('discord.js');

const { canModifyQueue } = require("../../modules/queue");

module.exports = {
  name: "stop",
  description: "Stops the music",
  category: "music",
  run: (client, message, args) => {
    return message.reply(new MessageEmbed().setDescription("Menhera no longer support music 😔\nBut! you can [invite beat music](https://discord.com/api/oauth2/authorize?client_id=881050313870684180&permissions=274914658560&scope=applications.commands%20bot)!")).catch(console.error);
    const queue = message.client.queue.get(message.guild.id);

    if (!queue) {
      const embed = new MessageEmbed().setDescription('Aww Sweety! There is nothing playing').setColor('RED')
      return message.reply(embed).catch(console.error);
    }
    if (!canModifyQueue(message.member)) return;

    queue.songs = [];
    queue.connection.dispatcher.end();
    const embed = new MessageEmbed().setDescription(`${message.author} ⏹ stopped the music!`).setColor('RED')
    queue.textChannel.send(embed).catch(console.error);
  }
};