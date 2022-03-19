const Discord = require('discord.js');
const { addModeration, removeModeration, getModerationOne } = require('../../function/dbfunctions');
const { sendModLogAuto, sendModLog } = require('../../function/functions')
const ms = require('ms');
module.exports = {
    name: 'mute',
    description: 'mutes a member [can be temp mute]',
    category: 'moderation',
    usage: '<user> (time) [reason]',
    permission: 'MANAGE_MESSAGES',
    botPermission: 'MANAGE_ROLES',
    args: true,
    run: async (client, message, args) => {
        //gets member and checks if member is in server with perms
        var member = await message.mentions.members.first() || await message.guild.members.fetch(args[0])
        if (!member.user) return message.channel.send('User not found');
        if (member.hasPermission('MANAGE_ROLES')) return message.channel.send('You can\'t mute this user');
        //gets server mute role and checks if it has one
        var muteid = message.guild.botSetting.muterole;
        if (muteid == null) return message.channel.send(`You don't have a mute role set up \n go to setup to set up one.`)
        if (member.roles.cache.has(muteid)) return message.channel.send('This user is already muted');
        var time
        try {
            time = ms(args[1])
        }
        catch { }
        var reason;
        if (isNaN(time)) {
            reason = args.slice(1).join(' ');
            args[1] = 'indefinetely';
        }
        else {
            reason = args.slice(2).join(' ');
        }

        if (time < 1000) return message.channel.send('Please mention the time in correct format')
        const embed = new Discord.MessageEmbed()
            .setAuthor(`Muted`, member.user.displayAvatarURL())
            .setColor('RED')
            .setDescription(`You have been Muted from \`\`${message.guild.name}\`\``)
            .addField('Muted by', message.author, true)
            .addField('Muted for', args[1], true)
            .setTimestamp()
        const embed1 = new Discord.MessageEmbed()
            .setAuthor(`Muted`, member.user.displayAvatarURL())
            .setColor('RED')
            .setDescription(`${member.user.username} has been Muted`)
            .addField('Muted by', message.author, true)
            .addField('Muted for', args[1], true)
            .setTimestamp()

        if (reason) {
            embed.addField('Reason', `${reason}`)
            embed1.addField('Reason', `${reason}`)
        }
        else {
            embed.addField('Reason', `No Reason Given.`)
            embed1.addField('Reason', `No Reason Given.`)
        }
        try {
            await member.roles.add(muteid)
        } catch (err) {
            message.channel.send(`could not mute user \n The role is higher up than me on the role list`)
            return
        }
        message.channel.send(embed1);
        sendModLog(message, message.guild.botSetting.logchannel, `Mute`, null, member, reason, args[1], client)
        member.send(embed).catch(function (err) {
            message.channel.send("Can't inform user. User muted")
        })
        if (!isNaN(time)) {
            var newtime = Date.now() + time;
            var mute = await addModeration(message.guild.id, member.user.id, 'mute', newtime);


            setTimeout(async function () {
                var checkMute = await getModerationOne(message.guild.id, mute)
                if (checkMute === null) return;
                member.roles.remove(muteid);
                const unMute = new Discord.MessageEmbed()
                    .setAuthor(`UnMuted`, member.user.displayAvatarURL())
                    .setColor('GREEN')
                    .setDescription(`${member.user.username} has been UnMuted`)
                    .addField('UnMuted by', client.user, true)
                    .setTimestamp()

                sendModLogAuto(message.guild, message.guild.botSetting.logchannel, unMute, client)
                removeModeration(message.guild.id, member.user.id, 'mute')
            }, time);
        }


    }
}
