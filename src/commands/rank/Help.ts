import { CommandInteraction, MessageEmbed, ColorResolvable } from "discord.js";
import DiscordClient from "../../client/client";
import CommandInt from "../../structures/BaseCommand";
import { CustomEmbed } from "../../utils/functions/Custom";

const RankHelp: CommandInt = {
    name: "rank help",
    description: "Edit the rank card's data",
    async run(
        client: DiscordClient,
        interaction: CommandInteraction<"cached">
    ) {
        interaction.followUp({
            embeds: [HelpEmbed(interaction, client)],
        });
        return;
    },
};

/**
 * @HelpEmbed
 * a useless function that i keep to remember the usage
 * @Noro
 */
function HelpEmbed(int: CommandInteraction, client: DiscordClient) {
    return new CustomEmbed(int)
        .setTitle("rank card customization")
        .setDescription(
            `TrackColor/TextColor only supports [**Color Names**](https://htmlcolorcodes.com/color-names/) and [**Hex Codes**](https://htmlcolorcodes.com/)
            **Tip:** *\`default\` in bg, track and text will reset it to default, \`0\` in opacity will also return it to the default value* `
        )
        .addField(
            "background",
            `**Usage:** \`bg: <Imgur or cdn.discord image link>\`\n**Example:** \`bg: https://cdn.discordapp.com/attachments/791301593391562752/856879146175954954/rankcard2.png\``
        )
        .addField(
            "opacity",
            `**Usage:** \`opacity: <0-100>\`\n **Example:** \`opacity: 70\``
        )
        .addField(
            "Track Color",
            `**Usage:** \`track: <Color>\`\n **Example:** \`track: #21cc87\``
        )
        .addField(
            "Text Color",
            `**Usage:** \`text: <Color>\`\n **Example:** \`text: #554b58\``
        );
}

export default RankHelp;
