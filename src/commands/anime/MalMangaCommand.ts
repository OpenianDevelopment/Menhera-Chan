import {
	Message,
	MessageActionRow,
	MessageButton,
	MessageEmbed,
} from "discord.js";
import DiscordClient from "../../client/client";
import { getMangaSearch } from "../../utils/functions/animeFunctions";
import { BaseCommand } from "../../utils/structures";
import { mal_manga_search_result_data } from "../../utils/interfaces/animeInterfaces";

export default class MalMangaCommand extends BaseCommand {
	constructor() {
		super(
			"mal-manga",
			"Search manga from MAL",
			"anime",
			["mm"],
			"mal-manga <search_query>",
			"mal-manga solo leveling"
		);
	}
	async run(client: DiscordClient, message: Message, args: Array<String>) {
		if (!args.length) {
			const embed = new MessageEmbed()
				.setColor("RED")
				.setDescription("You need to provide me with a query to search");
		}
		let currentPage = 0;
		const search_result = await getMangaSearch(args.join(" "));
		const embeds = generateQueueEmbed(search_result.data);

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
		const searchEmbed = await message.reply({
			content: `**Current Page - ${currentPage + 1}/${embeds.length}**`,
			embeds: [embeds[currentPage]],
			components: [forwardButton],
		});
		const filter = (m: any) => message.author.id === m.member.user.id;
		const collector = searchEmbed.createMessageComponentInteractionCollector(
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
			searchEmbed.edit({
				components: [],
			});
		});
	}
}

function generateQueueEmbed(manga_data: mal_manga_search_result_data[]) {
	const embeds: MessageEmbed[] = [];

	for (const manga of manga_data) {
		const genre = () => {
			let genreString = "";
			manga.genres.forEach((g) => {
				genreString += g.name + ", ";
			});
			return genreString;
		};
		const embed = new MessageEmbed()
			.setTitle(manga.title)
			.setURL(manga.url)
			.setThumbnail(manga.images.jpg.large_image_url)
			.setDescription(`**Synopsis:**\n${manga.synopsis}`)
			.addField("💳 MAL ID", `${manga.mal_id}`, true)
			.addField("📄 Chapters", `${manga.chapters}`, true)
			.addField("🗓️ Status", manga.status, true)
			.addField("🎬 Genres:", genre(), true);
		embeds.push(embed);
	}

	return embeds;
}
