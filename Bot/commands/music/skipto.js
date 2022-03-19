const { canModifyQueue } = require("../../modules/queue");
const { MessageEmbed } = require('discord.js')
module.exports = {
  name: "skipto",
  aliases: ["st"],
  description: "Skip to the selected queue number",
  category: "music",
  run: (client, message, args) => {
    if (!args.length || isNaN(args[0]))
      return message
        .reply(`Usage: ${module.exports.name} <Queue Number>`)
        .catch(console.error);

    const queue = message.client.queue.get(message.guild.id);
    if (!queue) {
      const embed = new MessageEmbed().setDescription('Aww Sweety! There is nothing playing').setColor('RED')
      return message.reply(embed).catch(console.error);
    }
    if (!canModifyQueue(message.member)) return;
    if (args[0] > queue.songs.length) {
      const embed = new MessageEmbed().setDescription(`Oh no Honey! The queue is only ${queue.songs.length} songs long!`)
      return message.reply(embed).catch(console.error);
    }


    queue.playing = true;

    if (queue.loop) {
      for (let i = 0; i < args[0] - 2; i++) {
        queue.songs.push(queue.songs.shift());
      }
    } else {
      queue.songs = queue.songs.slice(args[0] - 2);
    }

    queue.connection.dispatcher.end();
    const embed = new MessageEmbed().setDescription(`${message.author} ⏭ skipped ${args[0] - 1} songs`)
    queue.textChannel.send(embed).catch(console.error);
  }
};