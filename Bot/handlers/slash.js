//requirements
const { readdirSync } = require('fs');
// const ascii = require('ascii-table'); //importing
// let table = new ascii("Commands"); //creating a new table
const Discord = require('discord.js')

//table for console to show command load status in proper manner (optional)
// table.setHeading('Slash Command', 'Load Status'); //headings

module.exports = (client) => {
    readdirSync('./slashCommands/').forEach(dir => {
        const commands = readdirSync(`./slashCommands/${dir}/`).filter(file => file.endsWith('.js'));
        //looping through each file to save it in cache
        for (let file of commands) {
            let pull = require(`../slashCommands/${dir}/${file}`);
            //when a file is found
            if (pull.name) {
                client.SlashCommands.set(pull.name, pull);
                // table.addRow(file, '✅'); //when file is found
            }
            else {
                // table.addRow(file, '✅ -> missing a help.name, or help.name is not a string.'); //when file is missing
                continue;
            }


        }
    });
    // console.log(table.toString()); //printing table in console
}
