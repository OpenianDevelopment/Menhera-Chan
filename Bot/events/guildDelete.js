const { removeGuildSetting, removeXPBlacklist, removeGuildModerations, removeGuildWarns, removeGuildXP } = require('../function/dbfunctions')
const { deleteWelcomeRole, deleteNews, deleteWelcome, deleteAntispam } = require('../function/dbfunctions(2)')
const discordwh = require("discord-webhook-messages");
const botconfig = require("../botconfig.json");
const webhook = new discordwh.Webhook(botconfig.GuildUpdates_Webhook);

module.exports = (client, guild) => {
    removeGuildSetting(guild.id);
    removeXPBlacklist(guild.id);
    removeGuildModerations(guild.id);
    removeGuildWarns(guild.id);
    removeGuildXP(guild.id);
    deleteWelcomeRole(guild.id)
    deleteNews(guild.id);
    deleteWelcome(guild.id);
    deleteAntispam(guild.id)

    webhook.sendMessage(`**[REMOVE]** ${guild.name}`);
}