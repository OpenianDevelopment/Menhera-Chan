import BaseCommand from "../../structures/BaseCommand";
import DiscordClient from "../../client/client";
import {
    CommandInteraction,
    MessageEmbed,
} from "discord.js";
import { embedMaker } from "../../utils/functions/embed";
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
        embedMaker(interaction,embeds,page)
    }
}