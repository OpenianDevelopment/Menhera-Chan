import BaseCommand from "../../structures/BaseCommand";
import DiscordClient from "../../client/client";
import {
    CommandInteraction,
    MessageEmbed,
} from "discord.js";
import axios from "axios";
import config from "../../utils/config";

export default class MalUserCommand extends BaseCommand {
    constructor() {
        super("mal user", "To search an anime on MyAnimeList");
    }
    async run(client: DiscordClient, interaction: CommandInteraction) {
        let name = interaction.options.getString("name", true);
        const result = await axios
            .get(`https://api.jikan.moe/v3/user/${name}`)
            .catch((err) => {
                return;
            });
        if (!result || result.status != 200) {
            interaction.followUp({ content: `Could not find anything` });
            return;
        }
        const profile = new MessageEmbed()
            .setTitle(`${name}'s Profile`)
            .setURL(result.data.url)
            .setThumbnail(result.data.image_url)
            .addField(
                `<:MenheraWave:738775873217495160> Anime`,
                result.data.anime_stats.total_entries.toString(),
                true
            )
            .addField(`👀 Watching`, result.data.anime_stats.watching.toString(), true)
            .addField(`📊 Mean Score`, result.data.anime_stats.mean_score.toString(), true)
            .addField(
                `<:KomiBaka:743366396590948444> Manga`,
                result.data.manga_stats.total_entries.toString(),
                true
            )
            .addField(`👓 Reading`, result.data.manga_stats.reading.toString(), true)
            .addField(`📊 Mean Score`, result.data.manga_stats.mean_score.toString(), true)
            .addField(
                `🍰 Birthday`,
                new Date(result.data.birthday).toDateString(),
                true
            )
            .addField(
                `Joined`,
                new Date(result.data.joined).toDateString(),
                true
            );
        interaction.followUp({ embeds: [profile] });
        return;
    }
}
