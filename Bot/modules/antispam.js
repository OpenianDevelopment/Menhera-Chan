const Discord = require('discord.js');
const { getAntispam } = require('../function/dbfunctions(2)')
const userMap = new Map();
module.exports = async (client, message) => {
    if (message.guild.botSetting.antispam === 0) return;
    const antiSetting = await getAntispam(message.guild.id);

    if (!antiSetting.channels.includes(message.channel.id)) return;

    if (userMap.has(message.author.id)) {
        const userData = userMap.get(message.author.id);
        const { lastmsg, msgCount, messages } = userData;
        const timeDiff = message.createdTimestamp - lastmsg;
        let count = msgCount;
        count++;
        if (count >= antiSetting.count && timeDiff <= antiSetting.difference) {
            if (antiSetting.warn === 'on') {
                message.reply('Don\'t spam').then(sendMsg => {
                    sendMsg.delete({ timeout: 3000 });
                })
            }
            if (antiSetting.mute === 'on') {
                if (message.guild.me.hasPermission('MANAGE_ROLES')) {
                    if (message.guild.botSetting.muterole) {
                        message.author.roles.add(message.guild.botSetting.muterole)
                        setTimeout(message.author.roles.remove(message.guild.botSetting.muterole), 60000 * 20)
                    }
                }


            }
            if (antiSetting.delete === 'on') {
                if (message.guild.me.hasPermission('MANAGE_MESSAGES')) {
                    messages.forEach(m => {
                        const channel = message.guild.channels.cache.find(channel => channel.id === m.channel)
                        channel.messages.fetch(m.message).then(msg => {
                            msg.delete();
                        })
                    })
                }
            }
        }
        else if (timeDiff > antiSetting.difference) {
            userMap.delete(message.author.id);
            userMap.set(message.author.id, {
                lastmsg: message.createdTimestamp,
                msgCount: 1,
                messages: [{
                    message: message.id,
                    channel: message.channel.id
                }]
            })
        }
        else {
            userData.msgCount = count;
            userData.messages.push({
                message: message.id,
                channel: message.channel.id
            })
            userMap.set(message.author.id, userData)
        }
    }
    else {
        userMap.set(message.author.id, {
            lastmsg: message.createdTimestamp,
            msgCount: 1,
            messages: [{
                message: message.id,
                channel: message.channel.id
            }]
        })
    }
}