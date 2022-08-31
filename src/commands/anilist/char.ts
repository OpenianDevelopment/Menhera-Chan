import CommandInt from "../../structures/BaseCommand";
import DiscordClient from "../../client/client";
import { CommandInteraction, MessageEmbed } from "discord.js";
import fetch from "cross-fetch";
import { embedMaker } from "../../utils/functions/embed";
import { CustomEmbed } from "../../utils/functions/Custom";

const AniChar: CommandInt = {
    name: "ani char",
    description: "Search for a character in anilist's database",
    async run(client: DiscordClient, interaction: CommandInteraction) {
        let name = interaction.options.getString("name", true);
        const query = `query ($id: Int, $page: Int, $perPage: Int, $search: String) {
            Page(page: $page, perPage: $perPage) {
              pageInfo {
                total
                currentPage
                lastPage
                hasNextPage
                perPage
              }
              characters(id: $id, search: $search) {
                name {
                  full
                }
                image {
                  large
                }
                description
                gender
                age
                anime: media(page: 1, perPage: 5, type: ANIME) {
                  nodes {
                    title {
                      romaji
                    }
                  }
                }
                manga: media(page: 1, perPage: 5, type: MANGA) {
                  nodes {
                    title {
                      romaji
                    }
                  }
                }
              }
            }
          }`;
        const variables = {
            search: name,
            page: 1,
            perPage: 25,
        };

        const url = "https://graphql.anilist.co",
            options = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify({
                    query: query,
                    variables: variables,
                }),
            };

        const AnimeData = await fetch(url, options)
            .then(handleResponse)
            .catch(console.error);

        if (!AnimeData.data.Page.characters.length) {
            interaction.reply({ content: `Could not find anything` });
            return;
        }
        const data = AnimeData.data.Page.characters;
        let page = 0;
        const embeds: MessageEmbed[] = [];
        data.forEach((element: any) => {
            let anime = "";
            let manga = "";
            element.anime.nodes.forEach((Aelement: any) => {
                anime = Aelement.title.romaji + ` \n` + anime;
            });
            element.manga.nodes.forEach((Melement: any) => {
                manga = Melement.title.romaji + ` \n` + manga;
            });
            const embed = new CustomEmbed(interaction, false)
                .setTitle(element.name.full)
                .setImage(element.image.large)
                .setDescription("No description available.")
                .addField(
                    "Gender",
                    element.gender == null ? "Not available." : element.gender
                )
                .addField(
                    "Age",
                    element.age == null ? "Not available." : element.age
                )
                .addField("Anime", anime ? anime : "None")
                .addField("Manga", manga ? manga : "None");
            if (element.description != null) {
                if (element.description.length < 2000) {
                    embed.setDescription(element.description.toString());
                } else {
                    embed.setDescription(
                        element.description
                            .toString()
                            .slice(0, 2000 - element.description.length) + "..."
                    );
                }
            }
            embeds.push(embed);
        });
        await embedMaker(interaction, embeds, page);
    },
};

async function handleResponse(response: Response) {
    const json = await response.json();
    return response.ok ? json : Promise.reject(json);
}

export default AniChar;
