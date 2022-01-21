import BaseCommand from "../../structures/BaseCommand";
import DiscordClient from "../../client/client";
import {
    CommandInteraction,
    MessageEmbed,
    TextChannel,
} from "discord.js";
import fetch from "cross-fetch";
import { embed } from "../../utils/functions/embed";

export default class AniMangaCommand extends BaseCommand {
    constructor() {
        super("ani manga", "Search for manga in anilist's database");
    }
    async run(client: DiscordClient, interaction: CommandInteraction) {
        let name = interaction.options.getString("name", true);
        var query = `
        query ($id: Int, $page: Int, $perPage: Int, $search: String) {
            Page (page: $page, perPage: $perPage) {
              pageInfo {
                total
                currentPage
                lastPage
                hasNextPage
                perPage
              }
              media (id: $id, search: $search, type: MANGA) {
                id
                title {
                  romaji
                  english
                }
                description
                coverImage{
                  extraLarge
                }
                startDate{
                  year
                  month
                  day  
                }
                format
                status
                chapters
                volumes
                isAdult
                averageScore
                source
              }
            }
          }
        `;
        var variables = {
            search: name,
            page: 1,
            perPage: 25,
        };
        var url = "https://graphql.anilist.co",
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
        var animedata = await fetch(url, options)
            .then(handleResponse)
            .catch(console.error);
        if (animedata == undefined) {
            interaction.followUp({
                content: "```If you see this message contact devs```",
            });
            return;
        }
        var data = animedata.data.Page.media;
        if (data.length == 0) {
            interaction.followUp({ content: `Could not find anything` });
            return;
        }
        var page = 0;
        var embeds: MessageEmbed[] = [];
        data.forEach((element: any) => {
            if (
                element.isAdult == true &&
                !(interaction.channel as TextChannel).nsfw
            ) {
                const embed = new MessageEmbed()
                    .setTitle("Adult Content")
                    .setDescription(
                        "18+ content can only be viewed in nsfw channels"
                    );
                embeds.push(embed);
                return;
            }
            var newDescription;
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
            const embed = new MessageEmbed()
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
            embed.addField(
                `Status:`,
                element.status.toString().replace(/_/gi, " ").toLowerCase(),
                true
            );
            if (element.status != "NOT_YET_RELEASED") {
                embed.addField(`Volumes:`, `${element.volumes}`, true);
                embed.addField(`Chapters:`, `${element.chapters}`, true);
                embed.addField(`Format:`, element.format.toString(), true);
                if (element.source == null) {
                    embed.addField(`Source:`, `Unknown`, true);
                } else {
                    embed.addField(`Source:`, element.source.toString(), true);
                }
            }
            embed.addField(`18+:`, element.isAdult.toString(), true);
            embed.addField(
                `Link:`,
                `https://anilist.co/anime/${element.id}/`,
                true
            );
            embeds.push(embed);
        });
        await embed(interaction,embeds,page);
    }
}

async function handleResponse(response: Response) {
    const json = await response.json();
    return response.ok ? json : Promise.reject(json);
}
