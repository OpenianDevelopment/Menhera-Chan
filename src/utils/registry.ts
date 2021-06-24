import path from "path";
import { promises as fs } from "fs";
import DiscordClient from "../client/client";
import { getGuildSettings } from "../database/functions/getData";
import { Manager } from "erela.js";
import { MessageEmbed, Snowflake, TextChannel } from "discord.js";

export async function registerCommands(
	client: DiscordClient,
	dir: string = ""
) {
	const filePath = path.join(__dirname, dir);
	const files = await fs.readdir(filePath);
	for (const file of files) {
		const stat = await fs.lstat(path.join(filePath, file));
		if (stat.isDirectory()) registerCommands(client, path.join(dir, file));
		if (file.endsWith(".js") || file.endsWith(".ts")) {
			const { default: Command } = await import(path.join(dir, file));
			const command = new Command();
			client.commands.set(command.getName(), command);
			command.getAliases().forEach((alias: string) => {
				client.commands.set(alias, command);
			});
		}
	}
}

export async function registerEvents(client: DiscordClient, dir: string = "") {
	const filePath = path.join(__dirname, dir);
	const files = await fs.readdir(filePath);
	for (const file of files) {
		const stat = await fs.lstat(path.join(filePath, file));
		if (stat.isDirectory()) registerEvents(client, path.join(dir, file));
		if (file.endsWith(".js") || file.endsWith(".ts")) {
			const { default: Event } = await import(path.join(dir, file));
			const event = new Event();
			client.events.set(event.getName(), event);
			client.on(event.getName(), event.run.bind(event, client));
		}
	}
}
export async function registerSocketEvents(
	client: DiscordClient,
	dir: string = ""
) {
	const filePath = path.join(__dirname, dir);

	const files = await fs.readdir(filePath);

	for (const file of files) {
		const stat = await fs.lstat(path.join(filePath, file));
		if (stat.isDirectory()) registerSocketEvents(client, path.join(dir, file));
		if (file.endsWith(".js") || file.endsWith(".ts")) {
			const { default: Event } = await import(path.join(dir, file));
			const event = new Event();

			client.socket_events.set(event.getName(), event);
			client.socket.on(event.getName(), event.run.bind(event, client));
		}
	}
}

export async function registerConfig(client: DiscordClient) {
	const guilds = client.guilds.cache.array();
	for (const guild of guilds) {
		const result = await getGuildSettings(guild.id);
		if (!result) return;
		const guildSet = {
			prefix: result.prefix,
			xpsystem: result.xpsystem,
			antispam: result.antispam,
			logchannel: result.logchannel,
			welcome: result.welcome,
			invitelog: result.invite,
			muterole: result.muterole,
			newspublish: result.newspublish,
		};
		client.guildConfig.set(guild.id, guildSet);
	}
}

export function initErela(client: DiscordClient) {
	const manager = new Manager({
		nodes: [
			{
				host: "localhost",
				port: 5000,
				password: "password",
			},
		],
		send(id, payload) {
			const guild = client.guilds.cache.get(id as Snowflake);
			if (guild) guild.shard.send(payload);
		},
	})
		.on("nodeConnect", (node) => [
			console.log(`Node ${node.options.identifier} connected`),
		])
		.on("nodeError", (node, error) => {
			console.log(
				`Node ${node.options.identifier} had an error: ${error.message}`
			);
		})
		.on("trackStart", (player, track) => {
			if (!player.textChannel) return;
			const channel = client.channels?.cache.get(
				player.textChannel as Snowflake
			) as TextChannel;
			const embed = new MessageEmbed()
				.setColor("#554b58")
				.setDescription(`**Now playing:** ${track.title}`)
				.setThumbnail(
					track.thumbnail ? track.thumbnail : "https://i.imgur.com/FYBKE19.jpeg"
				);
			channel?.send({ embeds: [embed] });
		})
		.on("queueEnd", (player) => {
			if (!player.textChannel) return;
			const channel = client.channels?.cache.get(
				player.textChannel as Snowflake
			) as TextChannel;
			const embed = new MessageEmbed()
				.setColor("#554b58")
				.setDescription("Queue has Ended. Leaving the channel");
			channel?.send({ embeds: [embed] });
			player.destroy();
			client.queue.delete(player.guild);
		})
		.on("trackStuck", (player, track) => {
			player.stop();
		})
		.on("playerMove", (player, oldChannel, newChannel) => {
			if (!newChannel) {
				player.destroy();
			} else {
				player.voiceChannel = newChannel;
			}
		});
	return manager;
}
