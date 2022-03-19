const Discord = require("discord.js");

module.exports = {
    name: `vkick`,
    category: 'moderation',
    description: 'To disconnect a member from the voice channel',
    usage: '<member>',
    permission: 'MOVE_MEMBERS',
    botPermission: 'MOVE_MEMBERS',
    args: true,
    run: async (client, message, args) => {
        if (!message.member.permissions.has("MOVE_MEMBERS")) return message.reply("You can't use that command sweety");
        if (!message.guild.me.permissions.has("MOVE_MEMBERS")) return message.channel.send("I need `MOVE MEMBERS` permission");
        if (!args[0]) return message.channel.send("Usage: vkick <member>");
        let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(r => r.user.username.toLowerCase() === args.join(' ').toLocaleLowerCase()) || message.guild.members.cache.find(ro => ro.displayName.toLowerCase() === args.join(' ').toLocaleLowerCase());
        if (!member) return message.channel.send("I can't find that member.");
        if (!member.voice.channel) return message.channel.send(`I can't see **${member.user.tag}** in any voice channel`);
        try {
            const memberVC = await member.voice.channel;
            member.voice.kick({ reason: `Command executed by ${message.author.tag}` });

            const embed = new Discord.MessageEmbed()
                .setAuthor("Member kicked from the VC", member.user.displayAvatarURL(), "https://menhera-chan.in/")
                .setDescription(`${message.author} disconnected ${member} from **\`${memberVC.name}\`**`)
                .setTimestamp()
                .setColor("GREEN")
                .setFooter("https://menhera-chan.in/", client.user.displayAvatarURL());
            return message.channel.send(embed);
        } catch (err) {
            return message.channel.send("Sorry master, I couldn't disconnect that member <:remHmph:743600612926685196>");
        }
    }
}