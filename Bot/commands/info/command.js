const Discord = require('discord.js');
module.exports = {
    name: "command",
    aliases: ["c"],
    category: "info",
    description: "Returns one specific command info",
    usage: "[command | alias]",
    args: true,
    run: async (client, message, args) => {
            var embed1;
            var text=args.join(" ")
            const embed2 = new Discord.MessageEmbed()
            .setDescription("RED")
            .setDescription(`No information found for command **${text.toLowerCase()}**`)
            embed1 = getCMD(client, text)
            if(embed1 == undefined)return message.channel.send(embed2)
            return message.channel.send(embed1)
    }
}
function getCMD(client, input) {
    const embed = new Discord.MessageEmbed()

    const cmd = client.commands.get(input.toLowerCase()) || client.commands.get(client.aliases.get(input.toLowerCase()));
    
    let info = `No information found for command **${input.toLowerCase()}**`;

    if (!cmd)return

    if (cmd.name) info = `**Command name**: ${cmd.name}`;
    if (cmd.aliases) info += `\n**Aliases**: ${cmd.aliases.map(a => `\`${a}\``).join(", ")}`;
    if (cmd.description) info += `\n**Description**: ${cmd.description}`;
    if (cmd.usage) {
        info += `\n**Usage**: ${cmd.usage}`;
        embed.setFooter(`Syntax: <> = required, [] = optional`);
    }
    embed.setColor("GREEN").setDescription(info);
    return embed;
}