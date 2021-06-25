import {
	registerCommands,
	registerEvents,
	registerConfig,
	registerSocketEvents,
} from "./utils/registry";
require("dotenv").config();
import { connect } from "mongoose";
import DiscordClient from "./client/client";
import { filterPlugin } from "./Plugins/filterPlugin";

const client = new DiscordClient({
	intents: [
		"GUILDS",
		"GUILD_BANS",
		"GUILD_INVITES",
		"GUILD_MEMBERS",
		"GUILD_MESSAGES",
		"GUILD_MESSAGE_REACTIONS",
		"GUILD_VOICE_STATES",
	],
	allowedMentions: { parse: ["users", "roles"], repliedUser: false },
})

connect("mongodb://localhost:27017/Menhera", {
	useFindAndModify: true,
	useUnifiedTopology: true,
	useNewUrlParser: true,
	useCreateIndex: true,
})
	.then(() => {
		console.log("Connected to DB");
	})
	.catch((err) => {
		throw err;
	});

(async () => {
	await registerCommands(client, "../commands");
	await registerEvents(client, "../events");
	await registerSocketEvents(client, "../socketEvents");
	await filterPlugin();
	await client.login(process.env.TOKEN);

})();
