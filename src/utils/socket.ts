import WebSocketServer from "ws";
import DiscordClient from "../client/client";
import { updateCacheGuildSettings } from "./initialFunctions";

export default function Socket(client: DiscordClient, PORT: number) {
    // Creating a new websocket server
    const wss = new WebSocketServer.Server({ port: PORT });
    // Creating a new Map for websocket clients
    const clients: Map<
        WebSocketServer.WebSocket,
        {
            id: string;
            establishedAt: number;
            lastRequest: number;
            alive: boolean;
        }
    > = new Map();

    function heartbeat(ws: WebSocketServer.WebSocket) {
        const client = clients.get(ws);
        if (!client) return;
        client.alive = true;
        return;
    }
    // Creating connection using websocket
    wss.on("connection", (ws) => {
        console.log("new client connected");
        const id = uuidv4();
        const date = Date.now();

        clients.set(ws, {
            id: id,
            establishedAt: date,
            lastRequest: 0,
            alive: true,
        });
        ws.on("pong", () => heartbeat(ws));
        const interval = setInterval(function ping() {
            const currentClient = clients.get(ws);
            if (!currentClient) return;
            if (currentClient.alive == false) {
                console.log("force terminate");
                return ws.terminate();
            }

            currentClient.alive = false;
            ws.ping();
        }, 30 * 1000);
        // getting a cache update request
        ws.on("cacheUpdate", (data: RawGuildSettings) => {
            console.log(1);
            const currentClient = clients.get(ws);
            if (!currentClient) return ws.send(401);
            console.log(currentClient.id);
            const date = Date.now();
            if (currentClient.lastRequest + 5 * 60 * 1000 > date)
                return ws.send(429);
            currentClient.lastRequest = date;
            updateCacheGuildSettings(client, data.guild_id);
            ws.send("true?");
        });
        let i = 0;
        setInterval(() => {
            i++;
            ws.send("welcome! " + i);
        }, 10 * 1000);
        ws.on("message", function message(data) {
            console.log("received: %s", data);
        });
        // handling disconnections
        ws.once("close", () => {
            const client = clients.get(ws);
            console.log(`User with id ${client?.id} disconnected`);
            clients.delete(ws);
            clearInterval(interval);
        });
        // handling client connection error
        ws.onerror = function () {
            console.error("Some Error occurred");
        };
    });
    console.log(`The WebSocket server is running on port ${PORT}`);

    process.on("exit", (c) => {
        wss.clients.forEach((ws) => {
            ws.send(`[Bot logging off]`)
            ws.terminate();
        });
    });
}

function uuidv4() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
        /[xy]/g,
        function (char) {
            const r = (Math.random() * 16) | 0,
                v = char == "x" ? r : (r & 0x3) | 0x8;
            return v.toString(16);
        }
    );
}

interface RawGuildSettings {
    guild_id: string;
    // expSettings
    exp_enable: boolean;
    exp_increment: number;
    exp_timeDifference: number;
    exp_blacklistChannel: Array<string>;
    exp_expLogChannel: string | null;
    // antispamSettings
    antispam_enable: boolean;
    antispam_messageCount: number;
    antispam_timeDifference: number;
    antispam_antispamChannel: Array<string>;
    antispam_warnUser: boolean;
    antispam_muteUser: boolean;
    antispam_deleteMessage: boolean;
    // moderationSettings
    mod_enable: boolean;
    mod_modLogChannel: string | null;
    mod_modBlackList: Array<string>;
    // welcomeSettings
    welcome_enable: boolean;
    welcome_welcomeDM: boolean;
    welcome_welcomeChannel: boolean;
    welcome_welcomeChannelID: string | null;
    welcome_channelMessage: string | null;
    welcome_dmMessage: string | null;
    welcome_welcomeRoles: Array<string>;
    welcome_CustomWelcomeBackground: string | null;
    // starboardSettings
    starboard_enable: boolean;
    starboard_channelId: string | null;
    // inviteLogSettings
    inviteLog_enable: boolean;
    inviteLog_channelId: string | null;
    // misc
    misc_econ: boolean;
    misc_prefix: string;
    misc_lang: string;
}
