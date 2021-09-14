import DiscordClient from "./client/client";
import {
    connectDB,
    registerCommands,
    registerEvents,
} from "./utils/initialFunctions";
require("dotenv").config();
const client = new DiscordClient({
    intents: [
        "GUILDS",
        "GUILD_BANS",
        "GUILD_INVITES",
        "GUILD_VOICE_STATES",
        "GUILD_MEMBERS",
        "GUILD_MESSAGES",
    ],
});

(async () => {
    await registerEvents(client);
    await registerCommands(client);
    await connectDB();
    await client.login(process.env.TOKEN);
})();
