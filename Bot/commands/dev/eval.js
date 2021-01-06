const Discord = require('discord.js');;
const globalFunc = require('../../function/dbfunctions');

module.exports = {
    name: 'eval',
    description: 'evaluates',
    category:'dev',
    args: false,
    run:async(client,message,args)=>{
        var data = await globalFunc.bl(message.author.id,`dev`);
        if(data == null) return;
        const owners = ["534783899331461123", "180485886184521728", "687893451534106669"];
        if(!owners.includes(message.author.id)) return;

            const bot = client;
            const msg = message;
            const send = (channel, text) => { 
                if(!channel) return message.channel.send(text);
                client.channels.cache.get(channel).send(text);
            };
            const { Type } = require("@extreme_hero/deeptype");
            const { inspect } = require("util");
            const code = message.content.split(" ").slice(1).join(" ");
            if(!code) {
                return message.channel.send(`Still waiting`)
            };
         if (
                (code.includes("client.destroy()")) 
             || (code.includes("bot.destroy()"))
             || (code.includes("process.exit()"))
             || (code.includes("--no-preserve-root"))
            ) return message.channel.send("WTF NO!!");

            try {
                const start = process.hrtime();
                var evaled = eval(code);
                if(evaled instanceof Promise) {
                    evaled = await evaled;
                }
                const stop = process.hrtime(start);
                let evmbed = new Discord.MessageEmbed()
                .setColor("#00FF00")
                .setFooter(`Time Taken: ${(((stop[0] * 1e9) + stop[1])) / 1e6}ms`, client.user.displayAvatarURL())
                .setTitle("Eval") 
                .addField(`**Output:**`, `\`\`\`js\n${clean(inspect(evaled, {depth: 0}))}\n\`\`\``)
                .addField(`**Type:**`, new Type(evaled).is)
                const response = [
                    `\`\`\`js\n${clean(inspect(evaled, {depth: 0}))}\n\`\`\``
                ]
                var themsg;
                const res = response.join("\n");
                if(res.length<1000) {
                themsg = await message.channel.send(evmbed);
                } else if(res.length<=2000){
                    themsg = await message.channel.send("The result is too long");
                    //themsg = await message.channel.send(res);
                } else {
                    //const output = new Discord.MessageAttachment(Buffer.from(res), 'output.txt');
                    themsg = await message.channel.send("The result is too long");
                }
                    themsg.react("❎")
                    themsg.awaitReactions((reaction, user)=> (reaction.emoji.name === `❎`)&&user.id === message.author.id,{max :1, time: 15000})
                .then(r=>{
                    re0 = themsg.reactions.cache.filter(reaction => reaction.users.cache.has(message.author.id));
                    for (const re1 of re0.values()) {
                        re1.users.remove(message.author.id);
                    }
                    emote = r.map(r=>r.emoji.name).toString()
                    if(emote === `❎`){
                        themsg.delete();
                        message.delete();
                    }
                })
            } catch (err) {
                let errevmbed = new Discord.MessageEmbed()
                .setColor("#FF0000")
                .setTitle(`ERROR`)
                .setDescription(`\`\`\`xl\n${clean(err)}\n\`\`\``)
                .setTimestamp()
                .setFooter(client.user.username, client.user.displayAvatarURL());
                themsg = await message.channel.send(errevmbed);
                themsg.react("❎")
                themsg.awaitReactions((reaction, user)=> (reaction.emoji.name === `❎`)&&user.id === message.author.id,{max :1, time: 15000})
                .then(r=>{
                    re0 = themsg.reactions.cache.filter(reaction => reaction.users.cache.has(message.author.id));
                    for (const re1 of re0.values()) {
                        re1.users.remove(message.author.id);
                    }
                    emote = r.map(r=>r.emoji.name).toString()
                    if(emote === `❎`){
                        themsg.delete();
                        message.delete();
                    }
                })
            };
            function clean(text) {
                if (typeof text === "string") {
                    text = text
                        .replace(/`/g, `\`${String.fromCharCode(8203)}`)
                        .replace(/@/g, `@${String.fromCharCode(8203)}`)
                        .replace(new RegExp(client.token, 'gi'), `****`);
                    if(text.includes(client.token)) {
                        text.replace(client.token, "***NOPE***");
                    }
                }
                return text;
            }
    }
}