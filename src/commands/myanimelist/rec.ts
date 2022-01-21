import BaseCommand from "../../structures/BaseCommand";
import DiscordClient from "../../client/client";
import {
    ButtonInteraction,
    CommandInteraction,
    Message,
    MessageActionRow,
    MessageButton,
    MessageEmbed,
} from "discord.js";
import config from "../../utils/config";
import { MalRequest } from "../../utils/functions/Custom";


export default class MalRecCommand extends BaseCommand {
    constructor() {
        super("mal rec", "To search an anime on MyAnimeList");
    }
    async run(client: DiscordClient, interaction: CommandInteraction) {
        let anime_id = interaction.options.getNumber("id", true);

        const data = await new MalRequest().send([
            "anime",
            anime_id,
            "recommendations",
        ]);

        if (!data || data.length == 0) {
            interaction.followUp({ content: `Could not find anything` });
            return;
        }

        var page = 0;
        var embeds: MessageEmbed[] = [];
        var embed: MessageEmbed;
        data.recommendations.forEach((element: any) => {
            embed = new MessageEmbed()
                .setTitle(element.title)
                .setThumbnail(element.image_url)
                .addField("MAL ID: ", element.mal_id.toString())
                .addField("URL: ", element.url)
                .addField("Recommendation URL: ", element.recommendation_url)
                .setFooter(`Menhera Chan is Kawaii | ${config.links.website}`);
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
                    `Page ${page + 1} of ${embeds.length} | ${
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
                        `Page ${page + 1} of ${embeds.length} | ${
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
                        `Page ${page + 1} of ${embeds.length} | ${
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