const { canModifyQueue } = require("../../modules/queue");
const { MessageEmbed } = require('discord.js')
module.exports = {
  name: "loop",
  aliases: ["l"],
  description: "Toggle music loop",
  category: "music",
  run:(client,message,args)=> {
    const queue = message.client.queue.get(message.guild.id);
    if (!queue) {
        const embed = new MessageEmbed().setDescription('Aww Sweety! There is nothing playing').setColor('RED')
        return message.reply(embed).catch(console.error);
    }
    if (!canModifyQueue(message.member)) return;

    // toggle from false to true and reverse
    queue.loop = !queue.loop;
    const embed = new MessageEmbed().setDescription(`Loop is now ${queue.loop ? "**on**" : "**off**"}`).setColor('GREEN')
    return queue.textChannel.send(embed).catch(console.error);
  }
};