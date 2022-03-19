const { canModifyQueue } = require("../../modules/queue");
const { MessageEmbed } = require('discord.js')
module.exports = {
  name: "shuffle",
  description: "Shuffle queue",
  category: "music",
  run: (client, message, args) => {
    const queue = message.client.queue.get(message.guild.id);
    if (!queue) {
      const embed = new MessageEmbed().setDescription('Aww Sweety! There is nothing playing').setColor('RED')
      return message.reply(embed).catch(console.error);
    }
    if (!canModifyQueue(message.member)) return;

    let songs = queue.songs;
    for (let i = songs.length - 1; i > 1; i--) {
      let j = 1 + Math.floor(Math.random() * i);
      [songs[i], songs[j]] = [songs[j], songs[i]];
    }
    queue.songs = songs;
    message.client.queue.set(message.guild.id, queue);
    const skipped = new MessageEmbed().setDescription(`${message.author} 🔀 shuffled the queue`).setColor('GREEN')
    queue.textChannel.send(skipped).catch(console.error);
  }
};