const Discord = require('discord.js');
const globalFunc = require('../../function/dbfunctions');
const fs = require("fs");

module.exports = {
    name: 'reload',
    description: 'To reload a file, works only with command\'s files',
    category: 'dev',
    usage: "<command name>",
    args: false,
    run: async (client, message, args) => {
        var data = await globalFunc.bl(message.author.id, `dev`);
        if (data == null) return;

        if (!args[0]) return message.channel.send('wait what?');

        if (args[0] === "all") {
            var AllCounter = 0;
            if (message.content.toLowerCase().endsWith('--slash')) {
                fs.readdirSync('./slashCommands/').forEach(dir => {
                    const slashes = fs.readdirSync(`./slashCommands/${dir}`).filter(f => f.endsWith('.js'))
                    for (let file of slashes) {
                        AllCounter += 1;
                        delete require.cache[require.resolve(`../../slashCommands/${dir}/${file}`)];

                        const newallslash = require(`../../slashCommands/${dir}/${file}`);

                        client.SlashCommands.set(newallslash.name, newallslash);
                    }
                })
                message.channel.send(`Reloaded ${AllCounter} slash(es)`);
                AllCounter = 0;
                return;
            }
            fs.readdirSync('./commands').forEach(dir => {
                const commands = fs.readdirSync(`./commands/${dir}/`).filter(f => f.endsWith('.js'));
                for (let file of commands) {
                    AllCounter += 1;
                    delete require.cache[require.resolve(`../${dir}/${file}`)];

                    const newallcmd = require(`../${dir}/${file}`);

                    client.commands.set(newallcmd.name, newallcmd);
                }
            })
            message.channel.send(`Reloaded ${AllCounter} command(s)`);
            AllCounter = 0;
            return;
        }
        if (message.content.toLowerCase().endsWith('--slash')) {
            const slash = client.SlashCommands.get(args[0]);
            if (!slash) return message.channel.send('Couldn\'t find that slash command')
            fs.readdirSync('./slashCommands/').forEach(dir => {
                const slashes = fs.readdirSync(`./slashCommands/${dir}/`).filter(f => f.endsWith('.js') && f.toLowerCase() === `${slash.name}` + `.js`);
                for (let file of slashes) {
                    delete require.cache[require.resolve(`../../slashCommands/${dir}/${file}`)];

                    const newSlash = require(`../../slashCommands/${dir}/${file}`);

                    client.SlashCommands.set(newSlash.name, newSlash);
                }
            })
            return message.channel.send(`All the slashes with name **${args[0]}** were reloaded`)
        }
        const command = client.commands.get(args[0])
            || client.commands.get(client.aliases.get(args[0]));
        if (!command) return message.channel.send('Couldn\'t find that command')
        fs.readdirSync('./commands/').forEach(dir => {
            const commands = fs.readdirSync(`./commands/${dir}/`).filter(f => f.endsWith('.js') && f.toLowerCase() === `${command.name}` + `.js`);
            for (let file of commands) {
                delete require.cache[require.resolve(`../${dir}/${file}`)];

                const newCommand = require(`../${dir}/${file}`);

                client.commands.set(newCommand.name, newCommand);
            }
        })
        return message.channel.send(`All the commands with name **${args[0]}** were reloaded`)
    }
} 