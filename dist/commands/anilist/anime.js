"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BaseCommand_1 = __importDefault(require("../../structures/BaseCommand"));
const discord_js_1 = require("discord.js");
const cross_fetch_1 = __importDefault(require("cross-fetch"));
const config_1 = __importDefault(require("../../utils/config"));
class AniAnimeCommand extends BaseCommand_1.default {
    constructor() {
        super("ani anime", "Search for anime in anilist's database");
    }
    run(client, interaction) {
        return __awaiter(this, void 0, void 0, function* () {
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
            var url = "https://graphql.anilist.co", options = {
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
            var animedata = yield cross_fetch_1.default(url, options)
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
            var embeds = [];
            data.forEach((element) => {
                if (element.isAdult == true &&
                    !interaction.channel.nsfw) {
                    const embed = new discord_js_1.MessageEmbed()
                        .setTitle("Adult Content")
                        .setDescription("18+ content can only be viewed in nsfw channels");
                    embeds.push(embed);
                    return;
                }
                var newDescription;
                if (element.description != null) {
                    newDescription = element.description.replace(/(<([^>]+)>)/gi, "");
                }
                else {
                    newDescription = "No Description";
                }
                if (element.title.english != null) {
                    newDescription =
                        element.title.english + `\n` + `\n` + newDescription;
                }
                const embed = new discord_js_1.MessageEmbed()
                    .setTitle(element.title.romaji)
                    .setThumbnail(element.coverImage.extraLarge)
                    .setDescription(newDescription)
                    .addField(`ID:`, element.id.toString(), true);
                if (element.status != "NOT_YET_RELEASED") {
                    if (element.averageScore != null) {
                        embed.addField(`Average Score:`, element.averageScore + `%`, true);
                    }
                    embed.addField(`Aired:`, `(${element.startDate.day}/${element.startDate.month}/${element.startDate.year})`, true);
                }
                embed.addField(`Status:`, element.status.toString(), true);
                if (element.episodes == null) {
                    embed.addField(`Episodes:`, `Unknown`, true);
                }
                else {
                    embed.addField(`Episodes:`, element.episodes.toString(), true);
                }
                if (element.status != "NOT_YET_RELEASED") {
                    if (element.duration == null) {
                        embed.addField(`Duration:`, `Unknown`, true);
                    }
                    else {
                        embed.addField(`Duration:`, element.duration + " minute", true);
                    }
                }
                embed.addField(`Format:`, element.format.toString(), true);
                if (element.status != "NOT_YET_RELEASED") {
                    if (element.source == null) {
                        embed.addField(`Source:`, `Unknown`, true);
                    }
                    else {
                        embed.addField(`Source:`, element.source.toString(), true);
                    }
                }
                embed.addField(`18+:`, element.isAdult.toString(), true);
                if (element.status == "RELEASING" &&
                    element.nextAiringEpisode != null) {
                    var date = new Date().getTime() +
                        1000 * element.nextAiringEpisode.timeUntilAiring;
                    embed.addField(`Next Ep:`, `Ep ${element.nextAiringEpisode.episode} (${new Date(date).toDateString()})`, true);
                }
                embed.addField(`Link:`, `https://anilist.co/anime/${element.id}/`, true);
                embeds.push(embed);
            });
            const navbtns = new discord_js_1.MessageActionRow().addComponents(new discord_js_1.MessageButton()
                .setCustomId("previous")
                .setEmoji("⬅️")
                .setStyle("PRIMARY"), new discord_js_1.MessageButton()
                .setCustomId("next")
                .setEmoji("➡️")
                .setStyle("PRIMARY"));
            const navbtn_next = new discord_js_1.MessageActionRow().addComponents(new discord_js_1.MessageButton()
                .setCustomId("previous")
                .setEmoji("⬅️")
                .setStyle("PRIMARY")
                .setDisabled(true), new discord_js_1.MessageButton()
                .setCustomId("next")
                .setEmoji("➡️")
                .setStyle("PRIMARY"));
            const navbtn_prev = new discord_js_1.MessageActionRow().addComponents(new discord_js_1.MessageButton()
                .setCustomId("previous")
                .setEmoji("⬅️")
                .setStyle("PRIMARY"), new discord_js_1.MessageButton()
                .setCustomId("next")
                .setEmoji("➡️")
                .setStyle("PRIMARY")
                .setDisabled(true));
            const botmsg = (yield interaction.followUp({
                embeds: [embeds[page]],
                components: [navbtn_next],
            }));
            const filter = (int) => (int.customId == "next" || int.customId == "previous") &&
                int.user.id == interaction.user.id;
            const collector = botmsg.createMessageComponentCollector({
                filter,
                time: 120000,
            });
            collector.on("collect", (int) => __awaiter(this, void 0, void 0, function* () {
                yield int.deferUpdate({});
                if (int.customId == `previous`) {
                    if (page != 0) {
                        page--;
                        embeds[page].setFooter(`Page ${page + 1} of ${embeds.length} || ${config_1.default.links.website}`);
                        if (page == 0) {
                            yield int.editReply({
                                embeds: [embeds[page]],
                                components: [navbtn_next],
                            });
                            return;
                        }
                        else {
                            yield int.editReply({
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
                        embeds[page].setFooter(`Page ${page + 1} of ${embeds.length} || ${config_1.default.links.website}`);
                        if (page === embeds.length - 1) {
                            yield int.editReply({
                                embeds: [embeds[page]],
                                components: [navbtn_prev],
                            });
                            return;
                        }
                        else {
                            yield int.editReply({
                                embeds: [embeds[page]],
                                components: [navbtns],
                            });
                            return;
                        }
                    }
                }
            }));
        });
    }
}
exports.default = AniAnimeCommand;
function handleResponse(response) {
    return __awaiter(this, void 0, void 0, function* () {
        const json = yield response.json();
        return response.ok ? json : Promise.reject(json);
    });
}
