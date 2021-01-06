const {addGuildSetting, initWarn, initXP, initModeration, initXPBlacklist} = require('../function/dbfunctions')
const { initWelcomeRole, initNews, initWelcome, initAntispam } = require('../function/dbfunctions(2)')
const discordwh = require("discord-webhook-messages");
const webhook = new discordwh.Webhook("https://discordapp.com/api/webhooks/752795872592527381/I3eBiUR16GHZ5Xx6DFU0bKSnILbwqDvXgGwPCnGWFZxVrb3MrlOYyGsMiTDtSggkzCR1");

module.exports = (client,guild) => {
    addGuildSetting(guild.id);
    initWarn(guild.id);
    initXP(guild.id);
    initModeration(guild.id);
    initXPBlacklist(guild.id);
    initWelcomeRole(guild.id);
    initWelcome(guild.id);
    initNews(guild.id);
    initAntispam(guild.id)
    webhook.sendMessage(`**[ADD]** ${guild.name}`);
}