const { MessageEmbed } = require('discord.js');
const { interactionMsg } = require('../../function/functions');
const { Rp } = require('../../function/dbfunctions');
const Discord = require("discord.js");

module.exports = {
    name: 'cry', //user: not used
    run: async (client, args, guild) => {
        const me = await guild.members.fetch(client.user.id);
        if (!me.permissionsIn(args.channel_id).has(["SEND_MESSAGES", "EMBED_LINKS"])) return;

        const author = await client.users.fetch(args.member.user.id);

        var data = await Rp(`cry`)
        data = data[Math.floor(Math.random() * data.length)]

        var text;
        if (!args.data.options) {
            text = " ";
        } else if (args.data.options[0].length > 500) {
            text = "~ Your text is too long"
        } else {
            text = `~ ${await args.data.options[0].value}`;
        };
        const rtxt = [
            `**${author.username} *cries***`,
            `someone give **${author.username}** a hug`,
            `**${author.username} is crying :c**`,
        ];

        let rtext = rtxt[Math.floor(Math.random() * rtxt.length)];

        const embed = new Discord.MessageEmbed()
            .setDescription(`${rtext} ${text}`)
            .setImage(data.get(`img`))
            .setFooter(`sadie: ${author.username}, id: ${data.get(`_id`)}`, author.displayAvatarURL());

        interactionMsg(client, args, embed, null, [])
    }
}