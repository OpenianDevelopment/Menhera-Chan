const { getRankCard } = require('../../function/functions');
const { getXP } = require('../../function/dbfunctions');
var rankcard
module.exports = {
    name: 'level',
    aliases: ["l"],
    category: 'ranks',
    description: 'To see xp and level of a user',
    usage: '[user]',
    run: async (client, message, args) => {

        var member = message.mentions.members.first() || await message.guild.members.fetch(args[0])
        if (!member.user) {
            member = message.member
        }

        userXP = await getXP(member.user.id, message.guild.id);
        if (!userXP) {
            rankcard = await getRankCard(member, 0, 0, 0, 100)

        }
        else {
            rankcard = await getRankCard(member, userXP.users[0].xp, userXP.users[0].level, userXP.users[0].minxp, userXP.users[0].maxxp)
        }

        message.channel.send(rankcard);
    }
}