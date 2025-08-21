const {
	addGuildSetting,
	initXP,
	initWarn,
	initModeration,
	initXPBlacklist,
} = require("../function/dbfunctions");
const { reinit } = require("../function/functions");
const {
	initWelcomeRole,
	initWelcome,
	initNews,
	initAntispam,
} = require("../function/dbfunctions(2)");
const { ActivityType } = require("discord.js");
// Removed deprecated DBL library
// const vote = require("../modules/vote");

module.exports = (client) => {
	//vote(client)

	//connecting to the db when bot starts

	//Looping through all guilds to check if there data is in db. If not creating one
	client.guilds.cache.forEach((guilds) => {
		addGuildSetting(guilds.id);
		initXP(guilds.id);
		initWarn(guilds.id);
		initModeration(guilds.id);
		initXPBlacklist(guilds.id);
		reinit(guilds, client);
		initWelcomeRole(guilds.id);
		initWelcome(guilds.id);
		initNews(guilds.id);
		initAntispam(guilds.id);
	});

	// client.guilds.setting = await getAllGuildSetting()

	//for the counter
	client.counter = [];
	// Removed DBL stats posting since dblapi.js is deprecated
	console.log(`${client.user.username} has logged in`);

	client.user.setStatus("online");
	client.user.setActivity("mc!help", { type: ActivityType.Playing });
};
