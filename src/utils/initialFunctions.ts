import DiscordClient from "../client/client";
import path from "path";
import { promises as fs } from "fs";
import { connect } from "mongoose";

/**
 * Registering Events in Client#events
 * @param client {DiscordClient}
 * @param dir {string}
 */
export async function registerEvents(
    client: DiscordClient,
    dir: string = "../events"
) {
    const filePath = path.join(__dirname, dir);
    const files = await fs.readdir(filePath);
    for (const file of files) {
        if (file.endsWith(".js") || file.endsWith(".ts")) {
            const { default: Event } = await import(path.join(dir, file));
            const event = new Event();
            client.events.set(event.name, event);
            client.on(event.name, event.run.bind(event, client));
        }
    }
}

/**
 * Registering Command in Client#commands
 * @param client {DiscordClient}
 * @param dir {string}
 */
export async function registerCommands(
    client: DiscordClient,
    dir: string = "../commands"
) {
    const filePath = path.join(__dirname, dir);
    const files = await fs.readdir(filePath);
    for (const file of files) {
        const stat = await fs.lstat(path.join(filePath, file));
        if (stat.isDirectory())
            await registerCommands(client, path.join(dir, file));
        if (file.endsWith(".js") || file.endsWith(".ts")) {
            const { default: Command } = await import(path.join(dir, file));
            const command = new Command();
            client.commands.set(command.name, command);
        }
    }
}
export async function connectDB() {
    connect("mongodb://localhost:27017")
        .then(() => console.log("Connected to DB"))
        .catch(console.error);
}
