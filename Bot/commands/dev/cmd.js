const Discord = require('discord.js');;
const globalFunc = require('../../function/dbfunctions');

module.exports = {
    name: 'cmd',
    description: 'show cmd ussage',
    category:'dev',
    args: false,
    run:async(client,message,args)=>{
        var data = await globalFunc.bl(message.author.id,`dev`);
        if(data == null) return message.channel.send(`You're not a developer`);
        if(client.counter == undefined)return message.channel.send(`null`)
        let cmd = client.counter.find(e=>e.name===args[0]);

        if(args.length>=1) {
            if(!cmd) return message.channel.send("null");
            const embed = new Discord.MessageEmbed()
            .setColor("blue")
            .setTitle(`Uses of ${cmd.name}: ${cmd.count}`)
            return message.channel.send(embed);
        } 
        const embed = new Discord.MessageEmbed()
        .setColor("blue")
        var text=""
        var total=0;
        client.counter.forEach(element => {
            text = ` **${element.name}**: ${element.count}` + text
            total = element.count+total
        });
        embed.setTitle(`Total: ${total} uses`)
        embed.setDescription(text)
        return message.channel.send(embed);
    }
}