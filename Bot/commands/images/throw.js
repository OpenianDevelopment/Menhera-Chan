const Discord = require("discord.js");
const Canvas = require("canvas");
const moment = require("moment");
require("moment-duration-format");

module.exports = {
    name: "throw",
    alises: ["throwbaby"],
    category: "images",
    description: "Oh a maths nerd? your baby will go brrrr",
    usage: "<user>",
    botPermission: "ATTACH_FILES",
    run: async (client, message, args) => {
        message.channel.startTyping()

        const member = message.mentions.members.first()
            || message.guild.members.cache.get(args[0])
            || message.guild.members.cache.find(m => m.user.username.toLowerCase() === args.join(" ").toLocaleLowerCase())
            || message.guild.members.cache.find(m => m.displayName.toLowerCase() === args.join(" ").toLocaleLowerCase());
        //the member ^

        if (!member) {
            return message.channel.send("You need to mention a user or write their name").then(message.channel.stopTyping(true));
        }
        if (member.id === message.author.id) return message.channel.send(`${message.author.username}-sama, You can't throw yourself!!!`).then(message.channel.stopTyping(true));

        //some useless things just for fun
        if(member.id==="534783899331461123") return message.channel.send("You dare think about throwing my master!!!").then(message.channel.stopTyping(true));
        if(member.id==="722510934932848812"&&message.author.id!=="534783899331461123") return message.channel.send("Wait that's my sister, You want to throw her!! Consider yourself dead!!!").then(message.channel.stopTyping(true));

        const canvas = Canvas.createCanvas(630, 680);
        const ctx = canvas.getContext('2d');

        const bg = await Canvas.loadImage('././image/throw.png'); //bg
        ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);

        const AuthorAvatar = await Canvas.loadImage(message.author.displayAvatarURL({ format: 'png' })) //author avatar
        ctx.drawImage(AuthorAvatar, 68, 160, 70, 70);  //second panel (author - guy in green)
        ctx.drawImage(AuthorAvatar, 410, 60, 160, 160); //first panel (author - guy in green)

        const MemberAvatar = await Canvas.loadImage(member.user.displayAvatarURL({ format: 'png' })) //member avatar
        ctx.drawImage(MemberAvatar, 112.4, 222.3, 40, 40); //first panel (member - baby)
        ctx.drawImage(MemberAvatar, 518.7, 205, 92, 93);  //second panel (member - baby)
        ctx.drawImage(MemberAvatar, 367, 420.4, 30, 30);   //third panel (member - baby)

        const discordIcon = await Canvas.loadImage("././image/discord.png") //our mother (discord)
        ctx.drawImage(discordIcon, 182, 168, 85, 85) //first panel (mother discord)
        ctx.drawImage(discordIcon, 430.2, 434, 140, 140) //third panel (mother discord)

        const createdAt = moment.duration(Date.now() - member.user.createdTimestamp).format(`D`);
        //the member's account age in days ^
        ctx.font = applyText(canvas, createdAt);
        ctx.fillStyle = '#040404';
        ctx.fillText(createdAt, 145, 96, 160); //writing the days

        const atc = new Discord.MessageAttachment(canvas.toBuffer(), 'throw.png');

        return message.channel.send(atc).then(message.channel.stopTyping(true));
    }
}

function applyText(canvas, text) {
    const ctx = canvas.getContext('2d');
    let fontSize = 39;
    do {
        ctx.font = `${fontSize -= 7}px sans-serif`;
    } while (ctx.measureText(text).width > canvas.width - 300);
    return ctx.font;
}
