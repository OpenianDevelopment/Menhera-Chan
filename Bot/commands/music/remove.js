const { canModifyQueue } = require("../../modules/queue");
const { MessageEmbed } = require('discord.js')
module.exports = {
  name: "remove",
  aliases: ["rm"],
  description: "Remove song from the queue",
  category: "music",
  run: (client, message, args) => {
    return message.reply(new MessageEmbed().setDescription("Menhera no longer support music 😔\nBut! you can [invite beat music](https://discord.com/api/oauth2/authorize?client_id=881050313870684180&permissions=274914658560&scope=applications.commands%20bot)!")).catch(console.error);
    const queue = message.client.queue.get(message.guild.id);
    if (!queue) {
      const embed = new MessageEmbed().setDescription('Aww Sweety! There is nothing playing').setColor('RED')
      return message.reply(embed).catch(console.error);
    }
    if (!canModifyQueue(message.member)) return;


    if (isNaN(args[0])) return message.reply(`Usage: remove <Queue Number>`);

    const song = queue.songs.splice(args[0] - 1, 1);
    if (!song[0]) return message.channel.send(`Sweety, There is no song with number **\`${args[0]}\`** in the queue`)
    const embed = new MessageEmbed().setDescription(`${message.author} ❌ removed **${song[0].title}** from the queue.`).setColor('RED')
    queue.textChannel.send(embed);
  }
};