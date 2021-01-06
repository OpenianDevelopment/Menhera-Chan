const { canModifyQueue } = require("../../modules/queue");
const {MessageEmbed} = require("discord.js");
module.exports = {
  name: "volume",
  aliases: ["v"],
  description: "Change volume of currently playing music",
  category: "music",
  run:(client,message,args)=> {
    const queue = message.client.queue.get(message.guild.id);

    if (!queue){
        const embed = new MessageEmbed().setDescription('Aww Sweety! There is nothing playing').setColor('RED')
        return message.reply(embed).catch(console.error);
    }
    if (!canModifyQueue(message.member))
      return message.reply("You need to join a voice channel first!").catch(console.error);

    if (!args[0]) return message.reply(`🔊 The current volume is: **${queue.volume}%**`).catch(console.error);
    if (isNaN(args[0])) return message.reply("Please use a number to set volume.").catch(console.error);
    if (Number(args[0]) > 100 || Number(args[0]) < 0 )
      return message.reply("Please use a number between 0 - 100.").catch(console.error);

    queue.volume = args[0];
    queue.connection.dispatcher.setVolumeLogarithmic(args[0] / 100);

    return queue.textChannel.send(`Volume set to: **${args[0]}%**`).catch(console.error);
  }
};