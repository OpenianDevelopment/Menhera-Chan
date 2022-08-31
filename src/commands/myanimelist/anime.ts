import CommandInt from "../../structures/BaseCommand";
import DiscordClient from "../../client/client";
import { CommandInteraction, MessageEmbed, TextChannel } from "discord.js";
import { CustomEmbed, MalRequest } from "../../utils/functions/Custom";
import { embedMaker } from "../../utils/functions/embed";

const MALAnime: CommandInt = {
    name: "mal anime",
    description: "To search an anime on MyAnimeList",
    async run(client: DiscordClient, interaction: CommandInteraction) {
        const name = interaction.options.getString("name", true);
        let data = await new MalRequest().send(["search", "anime"], {
            q: name,
        });

        if (!data) {
            interaction.reply({
                content: `Could not find anything`,
                ephemeral: true,
            });
            return;
        }
        data = data.results;
        let page = 0;
        const embeds: MessageEmbed[] = [];
        let embed: MessageEmbed;
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
        embedMaker(interaction, embeds, page);
    },
};

export default MALAnime;
