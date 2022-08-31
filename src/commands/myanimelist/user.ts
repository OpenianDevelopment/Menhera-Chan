import CommandInt from "../../structures/BaseCommand";
import DiscordClient from "../../client/client";
import { CommandInteraction } from "discord.js";
import { CustomEmbed, MalRequest } from "../../utils/functions/Custom";
import config from "../../utils/config";

const MALUser: CommandInt = {
    name: "mal user",
    description: "To search an anime on MyAnimeList",
    async run(client: DiscordClient, interaction: CommandInteraction) {
        let name = interaction.options.getString("name", true);
        const data = await new MalRequest().send(["user", name]);

        if (!data) {
            interaction.reply({
                content: `Could not find anything`,
                ephemeral: true,
            });
            return;
        }
        const profile = new CustomEmbed(interaction, false)
            .setTitle(`${name}'s Profile`)
            .setURL(data.url)
            .setThumbnail(data.image_url)
            .addField(
                `${config.emojis.MenheraWave} Anime`,
                data.anime_stats.total_entries.toString(),
                true
            )
            .addField(
                `${config.emojis.eyes} Watching`,
                data.anime_stats.watching.toString(),
                true
            )
            .addField(
                `${config.emojis.statistics} Mean Score`,
                data.anime_stats.mean_score.toString(),
                true
            )
            .addField(
                `${config.emojis.KomiBaka} Manga`,
                data.manga_stats.total_entries.toString(),
                true
            )
            .addField(
                `${config.emojis.glasses} Reading`,
                data.manga_stats.reading.toString(),
                true
            )
            .addField(
                `${config.emojis.statistics} Mean Score`,
                data.manga_stats.mean_score.toString(),
                true
            )
            .addField(
                `${config.emojis.cake} Birthday`,
                new Date(data.birthday).toDateString(),
                true
            )
            .addField(`Joined`, new Date(data.joined).toDateString(), true)
            .setFooter({
                text: "Menhera Chan is Kawaii |" + config.links.website,
            });
        interaction.reply({ embeds: [profile] });
        return;
    },
};

export default MALUser;
