const { canModifyQueue } = require("../../modules/queue");
const { MessageEmbed } = require("discord.js")

module.exports = {
  name: "resume",
  aliases: ["r"],
  description: "Resume currently playing music",
  category: "music",
  run: (client, message, args) => {
    return message.reply(new MessageEmbed().setDescription("Menhera no longer support music 😔\nBut! you can [invite beat music](https://discord.com/api/oauth2/authorize?client_id=881050313870684180&permissions=274914658560&scope=applications.commands%20bot)!")).catch(console.error);
    const queue = message.client.queue.get(message.guild.id);
    if (!queue) {
      const embed = new MessageEmbed().setDescription('Aww Sweety! There is nothing playing').setColor('RED')
      return message.reply(embed).catch(console.error);
    }
    if (!canModifyQueue(message.member)) return;

    if (!queue.playing) {
      queue.playing = true;
      queue.connection.dispatcher.resume();
      const resumed = new MessageEmbed().setDescription(`${message.author} ▶ resumed the music!`).setColor('GREEN')

      return queue.textChannel.send(resumed).catch(console.error);
    }

    return message.reply("The queue is not paused.").catch(console.error);
  }
};