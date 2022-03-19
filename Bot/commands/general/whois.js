const Discord = require('discord.js')
module.exports = {
    name: 'whois',
    aliases: ["userinfo", "ui"],
    category: 'general',
    description: 'To get user info',
    usage: '[user]',
    run: async (client, message, args) => {
        var member = message.mentions.members.first() || await message.guild.members.fetch(args[0])
        if (!member.user) {
            member = message.member
            if (!member) return message.channel.send('User not found')
        }

        const joined = member.joinedAt.toDateString()
        const created = member.user.createdAt.toDateString()
        const roles = member.roles.cache.filter(r => r.id !== message.guild.id).map(r => r).join(", ") || 'none';
        var roleslength = roles.split(',')
        const permission = member.permissions.toArray();

        var permissionString = ''
        permission.forEach(p => {
            if (p === 'BAN_MEMBERS') {
                permissionString += 'Ban Members, '
            }
            if (p === 'KICK_MEMBERS') {
                permissionString += 'Kick Members, '
            }
            if (p === 'MUTE_MEMBERS') {
                permissionString += 'Mute Members, '
            }
            if (p === 'MANAGE_MESSAGES') {
                permissionString += 'Manage Messages, '
            }
            if (p === 'MANAGE_NICKNAMES') {
                permissionString += 'Change Nicknames, '
            }
            if (p === 'MANAGE_ROLES') {
                permissionString += 'Manage Roles, '
            }
            if (p === 'MANAGE_GUILD') {
                permissionString += 'Manage Server, '
            }
            if (p === 'ADMINISTRATOR') {
                permissionString += 'Administrator, '
            }
        })
        permissionString = permissionString.slice(0, -2)

        const embed = new Discord.MessageEmbed()
            .setAuthor(member.user.username, member.user.displayAvatarURL({ dynamic: true }))
            .setDescription(member.user)
            .setColor('#7289DA')
            .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
            .addField('Joined', `${joined}\t`, true)
            .addField('Created', created, true)
            .addField('User ID', member.user.id)
            .setTimestamp()
            .setFooter(`https://www.menhera-chan.in/`)
        if (roles.length < 1024) {
            embed.addField(`Roles[${roleslength.length}]`, roles)
        }
        else {
            embed.addField(`Roles[${roleslength.length}]`, 'Too Many roles to show')
        }
        if (permissionString != '')
            embed.addField('Permissions', permissionString)

        message.channel.send(embed);



    }
}