import { Socket } from "dgram";
import express from "express";
import http from "http";
import { Server } from "socket.io";
import DiscordClient from "../client/client";

const port = 4200;

export default async function server(client: DiscordClient) {
    const app = express();
    const server = http.createServer(app);

    const io = new Server(server, {
        cors: {
            origin: "http://localhost:3000", //allowing cors from anywhere
        },
    });

    app.get("/", (req, res) => {
        res.sendStatus(200);
    });

    io.on("connection", (socket) => {
        socket.on("requestCommands", () => {
            io.emit("commands", {
                interactions: JSON_PARSIFY(client.commands),
                message: [
                    JSON_PARSIFY(
                        client.msgCommands.find(
                            (cmd) => cmd.name === "roleplay"
                        )
                    ),
                ],
            });
        });
    });

    try {
        server.listen(port, () => {
            console.log(`listening on port ${port}`);
        });
    } catch (err) {
        console.error(err);
    }
}

function JSON_PARSIFY(str: any) {
    return JSON.parse(JSON.stringify(str));
}
