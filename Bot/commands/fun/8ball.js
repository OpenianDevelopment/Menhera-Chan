const Discord = require('discord.js');

module.exports = {
    name: '8ball',
    description: 'Ask the magical **8ball** a question and await the wisdom',
    category:'fun',
    usage: "<Question/Text>",
    args: true,
    run:(client,message,args)=>{
        var psans = [
            "As I see it, yes.",
            "Ask again later.",
            "Better not tell you now.",
            "Cannot predict now.",
            "Concentrate and ask again.",
            "Don’t count on it.",
            "It is certain.",
            "It is decidedly so.",
            "Most likely.",
            "My reply is no.",
            "My sources say no.",
            "Outlook not so good.",
            "Outlook good.",
            "Reply hazy, try again.",
            "Signs point to yes.",
            "Very doubtful.",
            "Without a doubt.",
            "Yes.",
            "Yes – definitely.",
            "You may rely on it.",
        ]
        psans = psans[Math.floor(Math.random() * psans.length)];
        return message.channel.send(psans);      
    }
}