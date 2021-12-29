import BaseCommand from "../../structures/BaseCommand";
import DiscordClient from "../../client/client";
import {
    ButtonInteraction,
    CommandInteraction,
    Message,
    MessageActionRow,
    MessageButton,
    MessageEmbed,
    TextChannel,
} from "discord.js";
import fetch from "cross-fetch";
import config from "../../utils/config";

export default class AniAnimeCommand extends BaseCommand {
    constructor() {
        super("ani anime", "Search for anime in anilist's database");
    }
    async run(client: DiscordClient, interaction: CommandInteraction) {
        let name = interaction.options.getString("name", true);
        var query = `query ($id: Int, $page: Int, $perPage: Int, $search: String) {
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

        const navbtns = new MessageActionRow().addComponents(
            new MessageButton()
                .setCustomId("previous")
                .setEmoji("⬅️")
                .setStyle("PRIMARY"),
            new MessageButton()
                .setCustomId("next")
                .setEmoji("➡️")
                .setStyle("PRIMARY")
        );
        const navbtn_next = new MessageActionRow().addComponents(
            new MessageButton()
                .setCustomId("previous")
                .setEmoji("⬅️")
                .setStyle("PRIMARY")
                .setDisabled(true),
            new MessageButton()
                .setCustomId("next")
                .setEmoji("➡️")
                .setStyle("PRIMARY")
        );
        const navbtn_prev = new MessageActionRow().addComponents(
            new MessageButton()
                .setCustomId("previous")
                .setEmoji("⬅️")
                .setStyle("PRIMARY"),
            new MessageButton()
                .setCustomId("next")
                .setEmoji("➡️")
                .setStyle("PRIMARY")
                .setDisabled(true)
        );
        const botmsg = (await interaction.followUp({
            embeds: [embeds[page]],
            components: [navbtn_next],
        })) as Message;
        const filter = (int: any) =>
            (int.customId == "next" || int.customId == "previous") &&
            int.user.id == interaction.user.id;
        const collector = botmsg.createMessageComponentCollector({
            filter,
            time: 120000,
        });
        collector.on("collect", async (int: ButtonInteraction) => {
            await int.deferUpdate({});
            if (int.customId == `previous`) {
                if (page != 0) {
                    page--;
                    embeds[page].setFooter(
                        `Page ${page + 1} of ${embeds.length} || ${
                            config.links.website
                        }`
                    );
                    if (page == 0) {
                        await int.editReply({
                            embeds: [embeds[page]],
                            components: [navbtn_next],
                        });
                        return;
                    } else {
                        await int.editReply({
                            embeds: [embeds[page]],
                            components: [navbtns],
                        });
                        return;
                    }
                }
            }
            if (int.customId == `next`) {
                if (page < embeds.length - 1) {
                    page++;
                    embeds[page].setFooter(
                        `Page ${page + 1} of ${embeds.length} || ${
                            config.links.website
                        }`
                    );
                    if (page === embeds.length - 1) {
                        await int.editReply({
                            embeds: [embeds[page]],
                            components: [navbtn_prev],
                        });
                        return;
                    } else {
                        await int.editReply({
                            embeds: [embeds[page]],
                            components: [navbtns],
                        });
                        return;
                    }
                }
            }
        });
    }
}

async function handleResponse(response: Response) {
    const json = await response.json();
    return response.ok ? json : Promise.reject(json);
}
