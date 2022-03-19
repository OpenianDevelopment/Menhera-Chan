const Discord = require('discord.js');
const dbfunctions = require('../function/dbfunctions')
const xp = require('../modules/xp');
const news = require('../modules/publish')
const antispam = require('../modules/antispam')
const economy = require('../modules/economy')
var prefix;
var flag = 1;
let embed;


module.exports = async (client, message) => {

    if (message.channel.type === "dm") return; //if the message was sent in DMs
    //getting guild settings from db and saving it in db

    news(client, message);
    if (message.author.bot) return; //return if message is from bot
    message.guild.botSetting = await dbfunctions.getGuildSetting(message.guild.id);
    if (message.guild.botSetting == undefined) return message.channel.send('Database not found please contact support');
    prefix = message.guild.botSetting.prefix;

    if (message.guild.botSetting.antispam === 1) {
        antispam(client, message)
    }

    xp(client, message); //xp system

    if (!message.content.startsWith(prefix)) return; //return if message don't start with prefix
    //working with commands

    const args = message.content.slice(prefix.length).split(/ +/)
    const cmd = args.shift().toLowerCase();
    if (cmd.length === 0) return; //return if it's only prefix without command

    let command = client.commands.get(cmd) //get command from command folder
        || client.commands.get(client.aliases.get(cmd)); //get command if command's alias is used

    if (command) {
        economy(message)
        var permission
        var botPermission
        if (command.permission) {
            permission = command.permission
            permission = permission.replace('_', ' ')
        }
        if (command.botPermission) {
            botPermission = command.botPermission
            botPermission = botPermission.replace('_', ' ')
        }

        if (!message.channel.permissionsFor(client.user.id).has(`SEND_MESSAGES`)) return;
        if (!message.channel.permissionsFor(client.user.id).has(`EMBED_LINKS`)) {
            embed = new Discord.MessageEmbed()
                .setTitle('Missing Permission')
                .setColor('RED')
                .setDescription('I am missing ``EMBED LINKS`` Permission')
            return message.channel.send(embed)
        }

        //checking command user permission with required permission list
        if ((!message.member.hasPermission(command.permission)) && (!message.member.roles.cache.find(role => role.name === 'MenheraMod'))) {
            embed = new Discord.MessageEmbed()
                .setTitle('Missing Permission')
                .setColor('RED')
                .setDescription(`Dang it! You don't have \`\`${permission}\`\` to use this command Sweety. Please contact your server owner to provide you with correct permission`)
            return message.channel.send(embed)
        }
        //checking bot permission        
        if (!message.guild.me.hasPermission(command.botPermission)) {
            embed = new Discord.MessageEmbed()
                .setTitle('Missing Permission')
                .setColor('RED')
                .setDescription(`Oh no! I don't have \`\`${botPermission}\`\` permission to perform this command. Can you be a Sugar Pie and give me those permission`)
            return message.channel.send(embed)
        }
        //if args is required then checking if arg is given or not

        if (command.args === true && args.length < 1) return message.channel.send(`${message.author.username} Sama, Please see \`\`command ${command.name}\`\` for info how to use command`)

        if (args.length > 1000) return message.channel.send(`${message.author.username} Sama, I can only read till 1000 characters`)


        let TheCommandCD = client.cooldowns.get(command.name);
        if (TheCommandCD.users.includes(message.author.id)) {
            const embed = new Discord.MessageEmbed()
                .setDescription(`honey you need to wait to use this command again, \nCommand cooldown: \`${TheCommandCD.cd} seconds\``)
            return message.channel.send(embed)
        };
        command.run(client, message, args);//running command

        TheCommandCD.users.push(message.author.id);
        setTimeout(function () {
            rae(TheCommandCD.users, message.author.id);
        }, TheCommandCD.cd * 1000);

        if (flag === 1) {
            flag = 0
            const embed = new Discord.MessageEmbed()
                .setColor('BLUE')
                .setDescription(`Please help us grow by voting to us \nhttps://top.gg/bot/731143954032230453/vote`)
            message.channel.send(embed)
            setTimeout(function () {
                flag = 1
            }, 1000 * 60 * 60 * 6)
        }
        if (client.counter.find(element => element.name == command.name)) {
            client.counter.find(element => element.name == command.name).count = client.counter.find(element => element.name == command.name).count + 1
        } else {
            client.counter.push({ name: command.name, count: 1 })
        }
    }
}
// remove element from array
function rae(array, n) {
    var index = array.indexOf(n);
    if (index > -1) {
        array.splice(index, 1);
    }
    return array;
}