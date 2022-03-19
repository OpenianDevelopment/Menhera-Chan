const Discord = require("discord.js");
const Canvas = require("canvas");

module.exports = {
    name: "rip",
    category: "image manipulation",
    description: "Big rip for this dead person 😢",
    usage: "[user]",
    botPermission: "ATTACH_FILES",
    run: async (client, message, args) => {
        message.channel.startTyping()
        const canvas = Canvas.createCanvas(630, 680);
        const ctx = canvas.getContext('2d');

        const bg = await Canvas.loadImage('././image/rip.png');
        ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);

        const member = message.mentions.members.first()
            || message.guild.members.cache.get(args[0])
            || message.guild.members.cache.find(m => m.user.username.toLowerCase() === args.join(" ").toLocaleLowerCase())
            || message.guild.members.cache.find(m => m.displayName.toLowerCase() === args.join(" ").toLocaleLowerCase())
            || message.member;

        const name = member.user.username;

        ctx.font = `bold 60px sans-serif`;
        ctx.fillStyle = `#546880`;
        ctx.fillText(`${name}`, 232, 234, 234);

        const avatar = await Canvas.loadImage(member.user.displayAvatarURL({ format: 'png' }))
        ctx.drawImage(avatar, 210, 256, 231, 227);

        const atc = new Discord.MessageAttachment(canvas.toBuffer(), 'rip.png');

        return message.channel.send(atc).then(message.channel.stopTyping(true))
    }
}