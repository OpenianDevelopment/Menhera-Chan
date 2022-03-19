const Discord = require("discord.js");
module.exports = {
    name: `vmove`,
    category: 'moderation',
    description: 'To move users to a different voice channel',
    usage: '<member> <voice channel>',
    permission: 'MOVE_MEMBERS',
    botPermission: 'MOVE_MEMBERS',
    args: true,
    run: async (client, message, args) => {
        if (!message.member.permissions.has("MOVE_MEMBERS")) return message.reply("You can't use that command sweety");
        if (!message.guild.me.permissions.has("MOVE_MEMBERS")) return message.channel.send("I need `MOVE MEMBERS` permission");
        if (!args[0]) return message.channel.send("Usage: vmove <member> <voice channel>");
        if (!args[1]) return message.channel.send("Usage: vmove <member> <voice channel>");
        const channel = message.guild.channels.cache.get(args[1]) ||
            message.guild.channels.cache.find(c => c.type === "voice" && c.name.toLowerCase() === args[1].toLowerCase());
        if (!channel) return message.channel.send("Honey, That's not a channel");
        if (channel.type !== "voice") return message.channel.send("That's not a voice channel!");
        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(r => r.user.username.toLowerCase() === args[0].toLowerCase()) || message.guild.members.cache.find(ro => ro.displayName.toLowerCase() === args[0].toLowerCase());
        if (!member.voice.channel) return message.channel.send(`I can't see **${member.user.tag}** in any voice channel`);
        if (!member) return message.channel.send("I can't find that member.");
        try {
            member.voice.setChannel(channel, `Command executed by ${message.author.tag}`);

            const embed = new Discord.MessageEmbed()
                .setAuthor("Member Moved Successfully", member.user.displayAvatarURL(), "https://menhera-chan.in/")
                .setDescription(`${message.author} moved ${member} to **\`${channel.name}\`**`)
                .setTimestamp()
                .setColor("GREEN")
                .setFooter("https://menhera-chan.in/", client.user.displayAvatarURL());
            return message.channel.send(embed);
        } catch (err) {
            return message.channel.send("Sorry master, I couldn't move that member <:remHmph:743600612926685196>");
        }
    }
} 