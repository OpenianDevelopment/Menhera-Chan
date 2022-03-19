const { MessageEmbed } = require('discord.js');
const { interactionMsg } = require('../../function/functions');
const { Rp } = require('../../function/dbfunctions');
const Discord = require("discord.js");

module.exports = {
    name: 'kill', //user: required 
    run: async (client, args, guild) => {
        const me = await guild.members.fetch(client.user.id);
        if (!me.permissionsIn(args.channel_id).has(["SEND_MESSAGES", "EMBED_LINKS"])) return;

        const author = await client.users.fetch(args.member.user.id);
        if (!args.data.options[0] || args.data.options[0].value === author.id) {
            const embed = new MessageEmbed()
                .setDescription("Uh oh, no suicide")
            return interactionMsg(client, args, embed, `<@${author.id}>`, { users: [author.id] })
        }
        const member = await guild.members.fetch(args.data.options[0].value);

        var data = await Rp(`kill`)
        data = data[Math.floor(Math.random() * data.length)]

        var text;
        if (!args.data.options[1]) {
            text = " ";
        } else if (args.data.options[1].length > 500) {
            text = "~ Your text is too long"
        } else {
            text = `~ ${await args.data.options[1].value}`;
        };

        let rtext = `**${author.username} killed ${member.user.username}**`

        const embed = new Discord.MessageEmbed()
            .setDescription(`${rtext} ${text}`)
            .setImage(data.get(`img`))
            .setFooter(`author: ${author.username}, id: ${data.get(`_id`)}`, author.displayAvatarURL());

        interactionMsg(client, args, embed, `<@!${member.user.id}>`, { "users": [member.user.id] })
    }
}