const Discord = require('discord.js');
const globalFunc = require('../../function/dbfunctions');
const fs = require("fs");

module.exports = {
    name: 'reload',
    description: 'To reload a file, works only with command\'s files',
    category:'dev',
    usage: "<command name>",
    args: false,
    run:async(client,message,args)=>{
        var data = await globalFunc.bl(message.author.id,`dev`);
        if(data == null) return;

        if(args[0] === "list") return message.channel.send(commands(), {split: true});
        
        const categoryName = args[0];
        if(!categoryName) return message.channel.send("usage: <category name> <command name>, if you don't remember the categories names check `mc!reload list`");
        
        const commandName = args.slice(1).join(' ').toLowerCase();
        if(!commandName) return message.channel.send("usage: <category name> <command name>, if you have a problem remembering the command's name check `mc!reload list`");
        
        const command = client.commands.get(commandName) 
        || client.commands.get(client.aliases.get(commandName));

        try {
            if (!command) return message.reply(`There is no file in **${categoryName}** with name **\`${commandName}\`**, if you think you are mistaken check \`mc!reload list\``);

            delete require.cache[require.resolve(`../${categoryName}/${command.name}.js`)];
            
            const newCommand = require(`../${categoryName}/${command.name}.js`);
            client.commands.set(newCommand.name, newCommand);

            return message.channel.send(`\`${command.name}\` was reloaded`)
        } catch (err) {
            message.channel.send(`\`\`\`xl\n${err}\n\`\`\``)
        }
        /*
        try {
            const commandName = args.join(' ').toLowerCase();

            if(!commandName) return message.channel.send("usage: <command name>");
        
            const command = client.commands.get(commandName) 
            || client.commands.get(client.aliases.get(commandName));

            if (!command) return message.reply(`There is no file with name **\`${commandName}\`**`);
            
            fs.readdirSync('../').forEach(dir => {
                delete require.cache[require.resolve(`../${dir}/${command.name}.js`)];
                
                const newCommand = require(`../${dir}/${command.name}.js`);

                if(!newCommand) return;

                try {
                    client.commands.set(newCommand.name, newCommand);
                } catch(err) {
                    message.channel.send(`\`\`\`xl\n${err}\n\`\`\``)
                }
            })
            return message.channel.send(`\`${command.name}\` was reloaded`)
        } catch (err) {
            message.channel.send(`\`\`\`xl\n${err}\n\`\`\``)
        }*/

        function commands() {
            return client.commands
                .map(cmd => `**${cmd.name}** ~ **${cmd.category}**`)
                .join("\n")
        }
    }
} 