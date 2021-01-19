const {removeGuildSetting, removeXPBlacklist, removeGuildModerations, removeGuildWarns, removeGuildXP} = require('../function/dbfunctions')
const { deleteWelcomeRole, deleteNews, deleteWelcome, deleteAntispam } = require('../function/dbfunctions(2)')
const discordwh = require("discord-webhook-messages");

const webhook = new discordwh.Webhook(/*the discord webhook url*/);

module.exports = (client,guilds) => {
    removeGuildSetting(guilds.id);
    removeXPBlacklist(guilds.id);
    removeGuildModerations(guilds.id);
    removeGuildWarns(guilds.id);
    removeGuildXP(guilds.id);
    deleteWelcomeRole(guilds.id)
    deleteNews(guilds.id);
    deleteWelcome(guilds.id);
    deleteAntispam(guilds.id)

    webhook.sendMessage(`**[REMOVE]** ${guilds.name}`);
}
