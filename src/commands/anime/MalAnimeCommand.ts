import { Message, MessageEmbed } from "discord.js";
import DiscordClient from "../../client/client";
import { getAnimeSearch } from "../../utils/functions/animeFunctions";
import { BaseCommand } from "../../utils/structures";
import { mal_anime_search_result_data } from "../../utils/interfaces/animeInterfaces";
import { PagesInteraction } from "../../utils/functions/utilityFunctions";

export default class MalAnimeCommand extends BaseCommand {
    constructor() {
        super(
            "mal-anime",
            "Search Anime from MAL",
            "anime",
            ["ma"],
            "mal-anime <search_query>",
            "mal-anime kakushigoto"
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

        const search_result = await getAnimeSearch(args.join(" "));
        const embeds = generateSearchEmbed(search_result.data);

        await PagesInteraction(embeds, message);
    }
}

function generateSearchEmbed(anime_data: mal_anime_search_result_data[]) {
    const embeds: MessageEmbed[] = [];

    for (const anime of anime_data) {
        const genre = () => {
            let genreString = "";
            anime.genres.forEach((g) => {
                genreString += g.name + ", ";
            });
            return genreString;
        };
        const embed = new MessageEmbed()
            .setTitle(anime.title)
            .setURL(anime.url)
            .setThumbnail(anime.images.jpg.large_image_url)
            .setDescription(`**Synopsis:**\n${anime.synopsis}`)
            .addField("💳 MAL ID", `${anime.mal_id}`, true)
            .addField("🖥️ Episodes", `${anime.episodes}`, true)
            .addField("🗓️ Status", anime.status, true)
            .addField("🎬 Genres:", genre(), true);
        embeds.push(embed);
    }

    return embeds;
}
