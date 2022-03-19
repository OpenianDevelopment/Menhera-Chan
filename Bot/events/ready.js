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
const vote = require("../modules/vote");
const DBL = require("dblapi.js");
const botconfig = require("../botconfig.json");

module.exports = (client) => {
	const dbl = new DBL(
		botconfig.DBL_token,
		client
	);

	vote(client)

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
	setInterval(async () => {
		//when sharding
		//const guildsShard = await client.shard.fetchClientValues("guilds.cache.size");
		//const size = guildsShard.reduce((acc, guildCount) => acc + guildCount, 0);
		const size = client.guilds.cache.size
		dbl.postStats(size, null, null);
	}, 1800000);
	console.log(`${client.user.username} has logged in`);

	client.user.setStatus("Online");
	client.user.setActivity("mc!help", { type: "PLAYING" });
};
