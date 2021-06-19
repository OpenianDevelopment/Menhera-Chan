import {
	Message,
	MessageActionRow,
	MessageButton,
	MessageEmbed,
	MessageReaction,
	User,
} from "discord.js";
import { Queue } from "erela.js";
import DiscordClient from "../../client/client";
import { checkMusicPermisison } from "../../utils/functions/musicFunctions";
import { BaseCommand } from "../../utils/structures";
export default class QueueCommand extends BaseCommand {
	constructor() {
		super("queue", "View the music Queue", "music", ["q"], "queue", "queue");
	}

	async run(client: DiscordClient, message: Message, args: Array<string>) {
		if (!checkMusicPermisison(client, message)) return;
		if (message.channel.type === "dm") return;
		const permissions = message.channel.permissionsFor(client.user || "");
		if (!permissions?.has(["MANAGE_MESSAGES", "ADD_REACTIONS"])) {
			const embed = new MessageEmbed()
				.setDescription(
					"Queue command requires `MANAGE_MESSAGES` and `ADD_REACTIONS` permission. Kindly provide me Sugar Pie"
				)
				.setColor("RED");
			message.reply({ embeds: [embed] });
		}
		const { player } = client.queue.get(message.guild?.id);
		let currentPage = 0;
		const embeds = generateQueueEmbed(message, player.queue);

		const queueEmbed = await message.reply({
			content: `**Current Page - ${currentPage + 1}/${embeds.length}**`,
			embeds: [embeds[currentPage]],
		});

		if (embeds.length === 1) return;
		const bothButton = new MessageActionRow().addComponents(
			new MessageButton()
				.setCustomID("prev")
				.setEmoji("⬅️")
				.setStyle("PRIMARY")
				.setLabel("Previous"),
			new MessageButton()
				.setCustomID("forw")
				.setEmoji("➡️")
				.setStyle("PRIMARY")
				.setLabel("Next")
		);
		const forwardButton = new MessageActionRow().addComponents(
			new MessageButton()
				.setCustomID("forw")
				.setEmoji("➡️")
				.setStyle("PRIMARY")
				.setLabel("Next")
		);
		const prevButton = new MessageActionRow().addComponents(
			new MessageButton()
				.setCustomID("prev")
				.setEmoji("⬅️")
				.setStyle("PRIMARY")
				.setLabel("Previous")
		);
		queueEmbed.edit({
			content: `**Current Page - ${currentPage + 1}/${embeds.length}**`,
			embeds: [embeds[currentPage]],
			components: [forwardButton],
		});

		const filter = (m: any) => message.author.id === m.member.user.id;
		const collector = queueEmbed.createMessageComponentInteractionCollector(
			filter,
			{ time: 60000 }
		);

		collector.on("collect", async (interaction) => {
			if (interaction.customID === "forw") {
				if (currentPage < embeds.length - 1) {
					currentPage++;
					if (currentPage === embeds.length - 1) {
						interaction.update({
							content: `**Current Page - ${currentPage + 1}/${embeds.length}**`,
							embeds: [embeds[currentPage]],
							components: [prevButton],
						});
					} else {
						interaction.update({
							content: `**Current Page - ${currentPage + 1}/${embeds.length}**`,
							embeds: [embeds[currentPage]],
							components: [bothButton],
						});
					}
				}
			} else if (interaction.customID === "prev") {
				if (currentPage !== 0) {
					--currentPage;
					if (currentPage === 0) {
						interaction.update({
							content: `**Current Page - ${currentPage + 1}/${embeds.length}**`,
							embeds: [embeds[currentPage]],
							components: [forwardButton],
						});
					} else {
						interaction.update({
							content: `**Current Page - ${currentPage + 1}/${embeds.length}**`,
							embeds: [embeds[currentPage]],
							components: [bothButton],
						});
					}
				}
			}
		});
		collector.on("end", (collected, reason) => {
			queueEmbed.edit({
				components: [],
			});
		});
	}
}
function generateQueueEmbed(message: Message, queue: Queue) {
	const embeds = [];
	let k = 10;

	for (let i = 0; i < queue.length; i += 10) {
		const currentQueue = queue.slice(i, k);
		let j = i;
		k += 10;

		const info = currentQueue
			.map((track) => `${++j} - [${track.title}](${track.uri})`)
			.join("\n");

		const embed = new MessageEmbed()
			.setTitle("Song Queue\n")
			.setThumbnail(message.guild?.iconURL() || "")
			.setColor("#554b58")
			.setDescription(
				`**Current Song - [${queue.current?.title}](${queue.current?.uri})**\n\n${info}`
			)
			.setTimestamp();
		embeds.push(embed);
	}

	return embeds;
}
