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
class AniUsersCommand extends BaseCommand_1.default {
    constructor() {
        super("ani users", "To look up anilist users");
    }
    run(client, interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            let name = interaction.options.getString("name", true);
            var query = `query ($id: Int, $page: Int, $perPage: Int, $search: String, $sort: [UserSort]) {
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
            var variables = {
                search: name,
                sort: "SEARCH_MATCH",
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
            var data = animedata.data.Page.users;
            if (data == undefined) {
                interaction.followUp({ content: `Search Error` });
                return;
            }
            if (data.length == 0) {
                interaction.followUp({ content: `Could not find anything` });
                return;
            }
            var page = 0;
            var embeds = [];
            data.forEach((element) => {
                const time = new Date(element.updatedAt * 1000);
                const embed = new discord_js_1.MessageEmbed()
                    .setTitle(element.name)
                    .setThumbnail(element.avatar.large)
                    .addField("ID:", element.id.toString(), true)
                    .addField("Anime Count:", element.statistics.anime.count.toString(), true)
                    .addField("Episode Count:", element.statistics.anime.episodesWatched.toString(), true)
                    .addField("Anime Watch Time:", element.statistics.anime.minutesWatched / 60 + " Hours", true)
                    .addField("Manga Read:", element.statistics.manga.count.toString(), true)
                    .addField("Chapters Read:", element.statistics.manga.chaptersRead.toString(), true)
                    .addField("Volumes Read:", element.statistics.manga.volumesRead.toString(), true)
                    .addField("Last Updated", `${time.getMonth()}/${time.getDay()}/${time.getFullYear()}`, true);
                if (element.unreadNotificationCount != null) {
                    embed.addField("Unread Notification:", element.unreadNotificationCount.toString(), true);
                }
                else {
                    embed.addField("Unread Notification:", "0", true);
                }
                if (element.about != null) {
                    embed.setDescription(element.about.toString());
                }
                else {
                    embed.setDescription("This user has nothing to say about themself");
                }
                embed.addField(`URL:`, element.siteUrl.toString(), true);
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
exports.default = AniUsersCommand;
function handleResponse(response) {
    return __awaiter(this, void 0, void 0, function* () {
        const json = yield response.json();
        return response.ok ? json : Promise.reject(json);
    });
}
