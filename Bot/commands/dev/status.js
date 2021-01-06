const Discord = require('discord.js');;
const globalFunc = require('../../function/dbfunctions');

module.exports = {
    name: 'status',
    description: 'change the status of the bot!',
    category:'dev',
    args: false,
    run:async(client,message,args)=>{
        var data = await globalFunc.bl(message.author.id,`dev`);
        if(data == null) return message.channel.send(`You're not a developer`);

        if(!args.length) return message.reply("I have never seen something that small, oh i meant the message")
        if(args.length>10) return message.reply("heyy wtf those are 50+ characters!")
        let oldstatus = await client.user.presence.activities[0].name;
        await client.user.setActivity(args.join(" "), {type: 'PLAYING'});
        const embed = new Discord.MessageEmbed()
        .setColor("green")
        .setDescription(`Status changed from: **\`${oldstatus}\`** to: **\`${args.join(" ")}\`**\nBy: ${message.author} | ${message.author.tag}`)
        return message.channel.send(embed);
    }
}