const Discord = require('discord.js')

module.exports = {
  name: 'serverinfo',
  aliases: ["server"],
  description: 'Shows the info of the server where the command is writen in',
  category: 'general',
  run: async (client, message, args) => {
    try {
      var GuildOwner = `<@${message.guild.ownerID}>` || message.guild.owner;
      if (!GuildOwner) GuildOwner = "The server's owner is not cached <:sorry:762202529756872704>";
      const createdAt = new Intl.DateTimeFormat('en-US').format(message.guild.createdAt);
      var embed = new Discord.MessageEmbed()
        .setThumbnail(message.guild.iconURL({ dynamic: true }))
        .setAuthor(message.guild.name)
        .setColor(`#800080`)
        .addFields(
          { name: `ID:`, value: message.guild.id, inline: true },
          { name: `Owner:`, value: GuildOwner, inline: true },
          { name: `Created At:`, value: createdAt, inline: true },
          { name: `Member Count:`, value: message.guild.memberCount, inline: true },
          { name: `Roles Count:`, value: message.guild.roles.cache.size, inline: true },
          { name: `Channels Count`, value: message.guild.channels.cache.size, inline: true },
          { name: `The Server's Region:`, value: message.guild.region, inline: true },
        )
        .setTimestamp()
        .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
      checks(message, embed)
      return message.channel.send(embed);
    } catch (err) {
      console.error(`Error in /general/serverinfo.js: ` + err)
    }
  }
}

function checks(message, embed) {
  if (message.guild.premiumSubscriptionCount > 0) {
    embed.addFields(
      { name: `Boosters Count`, value: message.guild.premiumSubscriptionCount, inline: true },
      { name: `Boosting Level`, value: message.guild.premiumTier, inline: true }
    )
  }
  if (message.guild.systemChannel) {
    embed.addField(`System Channel`, message.guild.systemChannel, true)
  }
  if (message.guild.afkChannel) {
    embed.addField(`AFK Channel`, "**`" + message.guild.afkChannel.name + "`**", true)
  }
  if (message.guild.banner) {
    embed.addField("Server's Banner", "[Press here](" + message.guild.bannerURL() + ")")
  }
  if (message.guild.verified) {
    embed.addField(`Is Verified?`, "Yes", true);
  }
  if (message.guild.partnered) {
    embed.addField(`Is partnered?`, "Yes!", true);
  }
  if (message.guild.features) {
    var features = message.guild.features.map(f => {
      var newf = f.toLowerCase()
        .replace("_", " ")
        .replace("_", " ")
        .replace("_", " ");
      var capedf = capitalizeFirstLetter(newf);
      return `**` + capedf + `**`
    }).join(",\n")
    if (!features) return;
    embed.addField("Server's Features", features + ".", false)
  }
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}