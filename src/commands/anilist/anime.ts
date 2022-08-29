import DiscordClient from "../../client/client";
import { CommandInteraction, MessageEmbed, TextChannel } from "discord.js";
import fetch from "cross-fetch";
import { embedMaker } from "../../utils/functions/embed";
import { CustomEmbed } from "../../utils/functions/Custom";

export default {
    name: "ani anime",
    description: "Search for anime in anilist's database",
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
              media(id: $id, search: $search, type: ANIME) {
                id
                title {
                  romaji
                  english
                }
                description
                coverImage {
                  extraLarge
                }
                startDate {
                  year
                  month
                  day
                }
                nextAiringEpisode {
                  episode
                  timeUntilAiring
                }
                format
                status
                episodes
                duration
                isAdult
                averageScore
                source
              }
            }
          }
          `;
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
        const animedata = await fetch(url, options)
            .then(handleResponse)
            .catch(console.error);
        if (animedata == undefined) {
            interaction.reply({
                content: "```If you see this message contact devs```",
            });
            return;
        }
        const data = animedata.data.Page.media;
        if (data.length == 0) {
            interaction.reply({ content: `Could not find anything` });
            return;
        }
        let page = 0;
        const embeds: MessageEmbed[] = [];
        data.forEach((element: any) => {
            if (
                element.isAdult == true &&
                !(interaction.channel as TextChannel).nsfw
            ) {
                const embed = new CustomEmbed(interaction, false)
                    .setTitle("Adult Content")
                    .setDescription(
                        "18+ content can only be viewed in nsfw channels"
                    );
                embeds.push(embed);
                return;
            }
            let newDescription;
            if (element.description != null) {
                newDescription = element.description.replace(
                    /(<([^>]+)>)/gi,
                    ""
                );
            } else {
                newDescription = "No Description";
            }
            if (element.title.english != null) {
                newDescription =
                    element.title.english + `\n` + `\n` + newDescription;
            }
            const embed = new CustomEmbed(interaction, false)
                .setTitle(element.title.romaji)
                .setThumbnail(element.coverImage.extraLarge)
                .setDescription(newDescription)
                .addField(`ID:`, element.id.toString(), true);
            if (element.status != "NOT_YET_RELEASED") {
                if (element.averageScore != null) {
                    embed.addField(
                        `Average Score:`,
                        element.averageScore + `%`,
                        true
                    );
                }
                embed.addField(
                    `Aired:`,
                    `(${element.startDate.day}/${element.startDate.month}/${element.startDate.year})`,
                    true
                );
            }
            embed.addField(`Status:`, element.status.toString(), true);
            if (element.episodes == null) {
                embed.addField(`Episodes:`, `Unknown`, true);
            } else {
                embed.addField(`Episodes:`, element.episodes.toString(), true);
            }
            if (element.status != "NOT_YET_RELEASED") {
                if (element.duration == null) {
                    embed.addField(`Duration:`, `Unknown`, true);
                } else {
                    embed.addField(
                        `Duration:`,
                        element.duration + " minute",
                        true
                    );
                }
            }
            embed.addField(`Format:`, element.format.toString(), true);
            if (element.status != "NOT_YET_RELEASED") {
                if (element.source == null) {
                    embed.addField(`Source:`, `Unknown`, true);
                } else {
                    embed.addField(`Source:`, element.source.toString(), true);
                }
            }
            embed.addField(`18+:`, element.isAdult.toString(), true);
            if (
                element.status == "RELEASING" &&
                element.nextAiringEpisode != null
            ) {
                var date =
                    new Date().getTime() +
                    1000 * element.nextAiringEpisode.timeUntilAiring;
                embed.addField(
                    `Next Ep:`,
                    `Ep ${element.nextAiringEpisode.episode} (${new Date(
                        date
                    ).toDateString()})`,
                    true
                );
            }
            embed.addField(
                `Link:`,
                `https://anilist.co/anime/${element.id}/`,
                true
            );
            embeds.push(embed);
        });
        await embedMaker(interaction, embeds, page);
    },
};
async function handleResponse(response: Response) {
    const json = await response.json();
    return response.ok ? json : Promise.reject(json);
}
