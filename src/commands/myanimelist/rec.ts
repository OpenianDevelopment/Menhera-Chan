import CommandInt from "../../structures/BaseCommand";
import DiscordClient from "../../client/client";
import { CommandInteraction, MessageEmbed } from "discord.js";
import { embedMaker } from "../../utils/functions/embed";
import config from "../../utils/config";
import { CustomEmbed, MalRequest } from "../../utils/functions/Custom";

const MAlRecommendations: CommandInt = {
    name: "mal rec",
    description: "To search an anime on MyAnimeList",
    async run(client: DiscordClient, interaction: CommandInteraction) {
        let anime_id = interaction.options.getNumber("id", true);

        const data = await new MalRequest().send([
            "anime",
            anime_id,
            "recommendations",
        ]);

        if (!data || data.length == 0) {
            interaction.reply({
                content: `Could not find anything`,
                ephemeral: true,
            });
            return;
        }

        let page = 0;
        const embeds: MessageEmbed[] = [];
        let embed: MessageEmbed;
        data.recommendations.forEach((element: any) => {
            embed = new CustomEmbed(interaction, false)
                .setTitle(element.title)
                .setThumbnail(element.image_url)
                .addField("MAL ID: ", element.mal_id.toString())
                .addField("URL: ", element.url)
                .addField("Recommendation URL: ", element.recommendation_url)
                .setFooter({
                    text: `Menhera Chan is Kawaii | ${config.links.website}`,
                });
            embeds.push(embed);
        });
        embedMaker(interaction, embeds, page);
    },
};

export default MAlRecommendations;
