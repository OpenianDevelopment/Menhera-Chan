import BaseInt from "../../structures/BaseCommand";
import DiscordClient from "../../client/client";
import { CommandInteraction, MessageEmbed } from "discord.js";
import fetch from "cross-fetch";
import { embedMaker } from "../../utils/functions/embed";
import { CustomEmbed } from "../../utils/functions/Custom";

export default class AniUsersCommand extends BaseInt {
    constructor() {
        super("ani users", "To look up anilist users");
    }
    async run(client: DiscordClient, interaction: CommandInteraction) {
        let name = interaction.options.getString("name", true);
        const query = `query ($id: Int, $page: Int, $perPage: Int, $search: String, $sort: [UserSort]) {
            Page(page: $page, perPage: $perPage) {
              pageInfo {
                total
                currentPage
                lastPage
                hasNextPage
                perPage
              }
              users(id: $id, search: $search, sort: $sort) {
                id
                name
                updatedAt
                avatar {
                  large
                  medium
                }
                about
                statistics {
                  anime {
                    count
                    episodesWatched
                    minutesWatched
                  }
                  manga {
                    count
                    volumesRead
                    chaptersRead
                  }
                }
                unreadNotificationCount
                siteUrl
              }
            }
          }
          `;
        const variables = {
            search: name,
            sort: "SEARCH_MATCH",
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
            interaction.followUp({
                content: "```If you see this message contact devs```",
            });
            return;
        }
        const data = animedata.data.Page.users;
        if (data == undefined) {
            interaction.followUp({ content: `Search Error` });
            return;
        }
        if (data.length == 0) {
            interaction.followUp({ content: `Could not find anything` });
            return;
        }
        let page = 0;
        const embeds: MessageEmbed[] = [];
        data.forEach((element: any) => {
            const time = new Date(element.updatedAt * 1000);
            const embed = new CustomEmbed(interaction, false)
                .setTitle(element.name)
                .setThumbnail(element.avatar.large)
                .addField("ID:", element.id.toString(), true)
                .addField(
                    "Anime Count:",
                    element.statistics.anime.count.toString(),
                    true
                )
                .addField(
                    "Episode Count:",
                    element.statistics.anime.episodesWatched.toString(),
                    true
                )
                .addField(
                    "Anime Watch Time:",
                    element.statistics.anime.minutesWatched / 60 + " Hours",
                    true
                )
                .addField(
                    "Manga Read:",
                    element.statistics.manga.count.toString(),
                    true
                )
                .addField(
                    "Chapters Read:",
                    element.statistics.manga.chaptersRead.toString(),
                    true
                )
                .addField(
                    "Volumes Read:",
                    element.statistics.manga.volumesRead.toString(),
                    true
                )
                .addField(
                    "Last Updated",
                    `${time.getMonth()}/${time.getDay()}/${time.getFullYear()}`,
                    true
                );
            if (element.unreadNotificationCount != null) {
                embed.addField(
                    "Unread Notification:",
                    element.unreadNotificationCount.toString(),
                    true
                );
            } else {
                embed.addField("Unread Notification:", "0", true);
            }
            if (element.about != null) {
                embed.setDescription(element.about.toString());
            } else {
                embed.setDescription(
                    "This user has nothing to say about themself"
                );
            }
            embed.addField(`URL:`, element.siteUrl.toString(), true);
            embeds.push(embed);
        });
        await embedMaker(interaction, embeds, page);
    }
}

async function handleResponse(response: Response) {
    const json = await response.json();
    return response.ok ? json : Promise.reject(json);
}
