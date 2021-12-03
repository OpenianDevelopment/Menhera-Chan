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
class AniCharCommand extends BaseCommand_1.default {
    constructor() {
        super("ani char", "Search for a character in anilist's database");
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
            var variables = {
                search: name,
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
            var AnimeData = yield cross_fetch_1.default(url, options)
                .then(handleResponse)
                .catch(console.error);
            if (AnimeData == undefined) {
                interaction.followUp({ content: `Could not find anything` });
                return;
            }
            var data = AnimeData.data.Page.characters;
            var page = 0;
            var embeds = [];
            data.forEach((element1) => __awaiter(this, void 0, void 0, function* () {
                var anime = "";
                var manga = "";
                yield element1.anime.nodes.forEach((Aelement) => {
                    anime = Aelement.title.romaji + ` \n` + anime;
                });
                yield element1.manga.nodes.forEach((Melement) => {
                    manga = Melement.title.romaji + ` \n` + manga;
                });
                const embed = new discord_js_1.MessageEmbed()
                    .setTitle(element1.name.full)
                    .setImage(element1.image.large)
                    .addField("Gender", element1.gender)
                    .addField("Age", element1.age)
                    .addField("Anime", anime)
                    .addField("Manga", manga);
                if (element1.description.length < 2000) {
                    embed.setDescription(element1.description);
                }
                else {
                    embed.setDescription(element1.description.slice(0, 2000 - element1.description.length) + "...");
                }
                embeds.push(embed);
            }));
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
exports.default = AniCharCommand;
function handleResponse(response) {
    return __awaiter(this, void 0, void 0, function* () {
        const json = yield response.json();
        return response.ok ? json : Promise.reject(json);
    });
}
