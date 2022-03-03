import BaseCommand from "../../structures/BaseCommand";
import DiscordClient from "../../client/client";
import { CommandInteraction } from "discord.js";
import { CustomEmbed, MalRequest } from "../../utils/functions/Custom";
import config from "../../utils/config";

export default class MalUserCommand extends BaseCommand {
    constructor() {
        super("mal user", "To search an anime on MyAnimeList");
    }
    async run(client: DiscordClient, interaction: CommandInteraction) {
        let name = interaction.options.getString("name", true);
        const data = await new MalRequest().send(["user", name]);

        if (!data) {
            interaction.followUp({ content: `Could not find anything` });
            return;
        }
        const profile = new CustomEmbed(interaction, false)
            .setTitle(`${name}'s Profile`)
            .setURL(data.url)
            .setThumbnail(data.image_url)
            .addField(
                `<:MenheraWave:738775873217495160> Anime`,
                data.anime_stats.total_entries.toString(),
                true
            )
            .addField(`👀 Watching`, data.anime_stats.watching.toString(), true)
            .addField(
                `📊 Mean Score`,
                data.anime_stats.mean_score.toString(),
                true
            )
            .addField(
                `<:KomiBaka:743366396590948444> Manga`,
                data.manga_stats.total_entries.toString(),
                true
            )
            .addField(`👓 Reading`, data.manga_stats.reading.toString(), true)
            .addField(
                `📊 Mean Score`,
                data.manga_stats.mean_score.toString(),
                true
            )
            .addField(
                `🍰 Birthday`,
                new Date(data.birthday).toDateString(),
                true
            )
            .addField(`Joined`, new Date(data.joined).toDateString(), true)
            .setFooter({
                text: "Menhera Chan is Kawaii |" + config.links.website,
            });
        interaction.followUp({ embeds: [profile] });
        return;
    }
}
