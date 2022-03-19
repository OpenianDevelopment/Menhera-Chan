const Discord = require('discord.js');
const globalFunc = require('../../function/dbfunctions');
module.exports = {
    name: 'blacklist',
    description: 'to blacklist users/guilds',
    aliases: ["bl"],
    usage: '<mod> <+/-> <id>',
    category: 'dev',
    args: true,
    run: async (client, message, args) => {
        var data = await globalFunc.bl(message.author.id, `dev`);
        var blm = await globalFunc.bl(message.author.id, `blm`);
        if (!data || !blm) return;
        if ((args[0] === "blm" || args[0] === "dev") && !data) return message.reply("You are not a developer so you can't make users blm/dev")
        let reason = args.slice(3).join(' ');
        if (!reason)
            reason = `No Given Reason`;
        const embed = new Discord.MessageEmbed()
        if (args[1] === '+') {
            if (args[0] === "blm") {
                globalFunc.blADD(args[2], args[0])
                embed
                    .setTitle('Blacklist-Manager Add')
                    .setDescription(`<@!${args[2]}> is now a blacklist-manager!`)
                return message.channel.send(embed);
            }
            if (args[0] === "dev") {
                globalFunc.blADD(args[2], args[0])
                embed
                    .setTitle('Added A Developer')
                    .setDescription(`Welcome to the team <@!${args[2]}>`)
                return message.channel.send(embed);
            }
            globalFunc.blADD(args[2], args[0])
            embed.setTitle('Blacklist Add')
                .setDescription(`<@!${args[2]}> was added to blacklist`)
                .addField(`reason:`, `${reason}`);
            return message.channel.send(embed);
        } else if (args[1] === '-') {
            if (args[0] === "blm") {
                globalFunc.blADD(args[2], args[0])
                embed
                    .setTitle('Blacklist-Manager Remove')
                    .setDescription(`<@!${args[2]}> was demoted from a blacklist-manager!`)
                    .addField(`reason:`, `${reason}`);
                return message.channel.send(embed);
            }
            if (args[0] === "dev") {
                const owners = ["534783899331461123", "180485886184521728", "687893451534106669"];
                if (!owners.includes(message.author.id)) return message.channel.send('Sorry but no!');
                if (owners.includes(args[2])) return message.channel.send(`uh sorry senpai but... I can't do that`);
                embed
                    .setTitle('Removed A Developer')
                    .setDescription(`<@!${args[2]}> was removed from the developers team`)
                    .addField(`reason:`, `${reason}`);
                return message.channel.send(embed);
            }
            globalFunc.blDROP(args[2], args[0])
            embed.setTitle('Blacklist Remove')
                .setDescription(`<@!${args[2]}> was removed from blacklist`)
                .addField(`reason:`, `${reason}`);
            return message.channel.send(embed);
        }
    }
}