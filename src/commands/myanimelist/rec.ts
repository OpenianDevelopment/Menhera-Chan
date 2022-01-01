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

export default class MalRecCommand extends BaseCommand {
    constructor() {
        super("mal rec", "To search an anime on MyAnimeList");
    }
    async run(client: DiscordClient, interaction: CommandInteraction) {
        let anime_id = interaction.options.getNumber("id", true);

        const data = await new Request().send([
            "anime",
            anime_id,
            "recommendations",
        ]);

        if (data == undefined || data.length == 0) {
            interaction.followUp({ content: `Could not find anything` });
            return;
        }

        var page = 0;
        var embeds: MessageEmbed[] = [];
        var embed: MessageEmbed;
        data.recommendations.forEach((element: any) => {
            if (
                element.rated === "Rx" &&
                !!(interaction.channel as TextChannel).nsfw
            ) {
                embed = new MessageEmbed()
                    .setTitle("NSFW Title")
                    .setThumbnail(
                        "https://techcrunch.com/wp-content/uploads/2017/04/tumblr-nsfw.png?w=711"
                    )
                    .setDescription(
                        "This Anime Can be viewed in NFSW Channel. Please move to next Page"
                    );
            } else {
                embed = new MessageEmbed()
                    .setTitle(element.title)
                    .setThumbnail(element.image_url)
                    .addField("MAL ID: ", element.mal_id.toString())
                    .addField("URL: ", element.url)
                    .addField(
                        "Recommendation URL: ",
                        element.recommendation_url
                    )
                    .setFooter(
                        `Menhera Chan is Kawaii || ${config.links.website}`
                    );
            }
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
            embeds: [
                embeds[page].setFooter(
                    `Page ${page + 1} of ${embeds.length} || ${
                        config.links.website
                    }`
                ),
            ],
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

/* From https://github.com/zuritor/jikanjs/blob/6a11bcf1d07dfc046e56ddf3ed94adc5db6ac822/lib/util/Request.js */
class Request {
    /**
     * sends a request with the given list of URL parts and the optional list of query parameter
     * @param {*[]} args           URL Parts
     * @param {{}} [parameter]     Query Parameter
     * @returns {Promise<*>} returns the request response or an error
     */
    async send(args: any, parameter?: any): Promise<any> {
        var response = await fetch(this.urlBuilder(args, parameter));
        var data = await response.json();

        if (response.status !== 200)
            return Promise.reject(new Error(data.error));
        return Promise.resolve(data);
    }

    /**
     *
     * @param {*[]} args            URL Parts
     * @param {{}} [parameter]      Query Parameter
     * @returns {string}            URL
     */
    urlBuilder(args: string[], parameter: any): string {
        var url = new URL("https://api.jikan.moe/v3");

        url.pathname += "/" + args.filter((x: any) => x).join("/");
        if (parameter)
            Object.entries(parameter).forEach(([key, value]) =>
                url.searchParams.append(key, `${value}`)
            );

        return url.href;
    }
}
