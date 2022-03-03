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
import config from "../../utils/config";
import { CustomEmbed, MalRequest } from "../../utils/functions/Custom";

export default class MalAnimeCommand extends BaseCommand {
    constructor() {
        super("mal anime", "To search an anime on MyAnimeList");
    }
    async run(client: DiscordClient, interaction: CommandInteraction) {
        let name = interaction.options.getString("name", true);
        var data = await new MalRequest().send(["search", "anime"], {
            q: name,
        });

        if (!data) {
            interaction.followUp({ content: `Could not find anything` });
            return;
        }
        data = data.results;
        var page = 0;
        var embeds: MessageEmbed[] = [];
        var embed: MessageEmbed;
        console.log(data);
        data.forEach((element: any) => {
            if (
                element.rated === "Rx" &&
                !(interaction.channel as TextChannel).nsfw
            ) {
                embed = new CustomEmbed(interaction, false)
                    .setTitle("NSFW Title")
                    .setThumbnail(
                        "https://techcrunch.com/wp-content/uploads/2017/04/tumblr-nsfw.png?w=711"
                    )
                    .setDescription(
                        "This Anime Can be viewed in NFSW Channel. Please move to next Page"
                    );
            } else {
                embed = new CustomEmbed(interaction, false)
                    .setTitle(element.title)
                    .setThumbnail(element.image_url)
                    .addField("Episodes: ", element.episodes.toString())
                    .addField("MAL ID: ", element.mal_id.toString())
                    .addField("URL: ", element.url)
                    .setDescription(`**Synopsis**: ${element.synopsis}`);
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
                embeds[page].setFooter({
                    text: `Page ${page + 1} of ${embeds.length} | ${
                        config.links.website
                    }`,
                }),
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
                    embeds[page].setFooter({
                        text: `Page ${page + 1} of ${embeds.length} | ${
                            config.links.website
                        }`,
                    });
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
                    embeds[page].setFooter({
                        text: `Page ${page + 1} of ${embeds.length} | ${
                            config.links.website
                        }`,
                    });
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
