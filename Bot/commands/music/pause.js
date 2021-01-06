const { canModifyQueue } = require("../../modules/queue");
const { MessageEmbed } = require("discord.js");
module.exports = {
  name: "pause",
  description: "Pause the currently playing music",
  category: "music",
  run:(client, message, args) => {
    const queue = message.client.queue.get(message.guild.id);
    if (!queue){
        const embed = new MessageEmbed().setDescription('Aww Sweety! There is nothing playing').setColor('RED')
        return message.reply(embed).catch(console.error);
    }
    if (!canModifyQueue(message.member)) return;

    if (queue.playing) {
      queue.playing = false;
      queue.connection.dispatcher.pause(true);
      const paused = new MessageEmbed().setDescription(`${message.author} ⏸ paused the music.`).setColor('RED') 
      return queue.textChannel.send(paused).catch(console.error);
    }
  }
};