const Discord = require('discord.js');
const ms = require('ms');
const { time } = require('console');
const globalFunc = require('../../function/dbfunctions');
module.exports = {
    name: 'countdown',
    description: 'countdown',
    usage: '<time>',
    category: 'dev',
    args: true,
    run: async (client, message, args) => {
        var data1 = await globalFunc.bl(message.author.id, "dev")
        if (data1 == null) return message.channel.send(`You're not a developer`)
        if (isNaN(parseInt(args[0]))) return message.channel.send("``" + args[0] + "``" + ` is not a number`)
        var time = ms(args[0]);
        var end = Date.now() + time;
        var text = args.slice(1).join(' ');
        const embed = new Discord.MessageEmbed()
            .setColor('#7851a9')
            .setTitle(`Countdown`)
            .setDescription(`Setting up`)
        var botmsg = await message.channel.send(embed)
        timer(message, botmsg, end, text)
        message.delete();
    }
}
function timer(message, botmsg, end, text) {
    var time = new Date(new Date(end).getTime() - new Date().getTime()).getTime();
    var countdown = convertMS(time)
    if (time < 0) {
        const embed1 = new Discord.MessageEmbed()
            .setColor('#7851a9')
            .setTitle(`Countdown`)
            .setDescription(`Countdown Finished!`)
        botmsg.edit(embed1)
        message.channel.send(text)
        return
    }
    const embed = new Discord.MessageEmbed()
        .setColor('#7851a9')
        .setTitle(`Countdown`)
        .setDescription(`Days ${countdown.day}: Hours ${countdown.hour}: Mins ${countdown.minute} :Sec ${countdown.seconds}`)
    botmsg.edit(embed)
    setTimeout(timer, 5000, message, botmsg, end, text)
}
function convertMS(milliseconds) {
    var day, hour, minute, seconds;
    seconds = Math.floor(milliseconds / 1000);
    minute = Math.floor(seconds / 60);
    seconds = seconds % 60;
    hour = Math.floor(minute / 60);
    minute = minute % 60;
    day = Math.floor(hour / 24);
    hour = hour % 24;
    return {
        day: day,
        hour: hour,
        minute: minute,
        seconds: seconds
    };
}