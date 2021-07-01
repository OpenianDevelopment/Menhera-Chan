import { Message, MessageEmbed } from "discord.js";
import DiscordClient from "../../client/client";
import { getMangaSearch } from "../../utils/functions/animeFunctions";
import { BaseCommand } from "../../utils/structures";
import { mal_manga_search_result_data } from "../../utils/interfaces/animeInterfaces";
import { PagesInteraction } from "../../utils/functions/utilityFunctions";

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
                .setDescription(
                    "You need to provide me with a query to search"
                );
            await message.reply({
                embeds: [embed],
            });
            return;
        }
        const search_result = await getMangaSearch(args.join(" "));
        const embeds = generateQueueEmbed(search_result.data);

        await PagesInteraction(embeds, message);
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
