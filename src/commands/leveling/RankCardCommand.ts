import { CommandInteraction, MessageEmbed, ColorResolvable } from "discord.js";
import DiscordClient from "../../client/client";
import {
    getLevel,
    updateUserBackground,
    updateUserOpacity,
    updateUserTrackColor,
    updateUserTextColor,
} from "../../database/functions/levelingOperation";

import BaseCommand from "../../structures/BaseCommand";

export default class RankOptionCommand extends BaseCommand {
    constructor() {
        super("rank-options", "Edit the rank card's data");
    }

    async run(client: DiscordClient, interaction: CommandInteraction) {
        if (!interaction.guild) return;
        const GuildID = interaction.guild!.id;
        const UserID = interaction.user.id;
        const embed = new MessageEmbed();

        const GX = await getLevel(interaction.guild?.id);
        const UI = GX.users.findIndex((d: any) => {
            return d.user === UserID;
        });
        const choice = interaction.options
            .getString("option", true)
            .toLowerCase();
        const input = interaction.options.getString("input", true);

        if (UI < 0) {
            embed
                .setColor("RED")
                .setDescription(
                    "❌ I don't have any data for you at this moment. Kindly gain some XP first"
                );
            interaction.followUp({ embeds: [embed] });
            return;
        }
        if (["bg", "background", "image", "img"].includes(choice)) {
            if (input.toLowerCase() == "default") {
                updateUserBackground(
                    UserID,
                    GuildID,
                    "https://cdn.discordapp.com/attachments/791301593391562752/856879146175954954/rankcard2.png"
                );
                embed
                    .setDescription(
                        `The background is back to default: [Image](https://cdn.discordapp.com/attachments/791301593391562752/856879146175954954/rankcard2.png)`
                    )
                    .setImage(
                        "https://cdn.discordapp.com/attachments/791301593391562752/856879146175954954/rankcard2.png"
                    );
                interaction.followUp({ embeds: [embed] });
                return;
            }
            if (
                !input.startsWith("https://i.imgur.com") ||
                !input.startsWith("https://cdn.discord.com")
            ) {
                interaction.followUp({
                    content: `We only support https://i.imgur.com and https://cdn.discord.com links only`,
                });
                return;
            }
        }
        if (["opacity", "op"].includes(choice)) {
            if (input.toLowerCase() == "default") {
                updateUserOpacity(UserID, GuildID, 0.7);
                interaction.followUp({
                    content: "Opacity is back to default: **70%**",
                });
                return;
            }
            const num = Number(input);
            if (!num || num > 100 || num < 0) {
                interaction.followUp({
                    content: "This is not a number between **0** and **100**!",
                });
                return;
            }
            updateUserOpacity(UserID, GuildID, num / 100);
            interaction.followUp({ content: `Opacity is now **${num}%**` });
            return;
        }
        if (["trackcolor", "track"].includes(choice)) {
            if (input.toLowerCase() == "default") {
                updateUserTrackColor(UserID, GuildID, "#21cc87");
                interaction.followUp({
                    content: "Track color is back to default: `#21cc87`",
                });
                return;
            }
            if (isColor(input)) {
                updateUserTrackColor(UserID, GuildID, input);
                embed
                    .setColor(input as ColorResolvable)
                    .setDescription(`Track color is now **${input}**`);
                interaction.followUp({ embeds: [embed] });
                return;
            }
            interaction.followUp({ content: "This is not a supported color!" });
            return;
        }
        if (["textcolor", "text"].includes(choice)) {
            if (input.toLowerCase() == "default") {
                updateUserTextColor(UserID, GuildID, "#f5deb3");
                interaction.followUp({
                    content: "Text color is back to default: `#f5deb3`",
                });
                return;
            }
            if (isColor(input)) {
                updateUserTextColor(UserID, GuildID, input);
                embed
                    .setColor(input as ColorResolvable)
                    .setDescription(
                        `Text color is now colored with **${input}**`
                    );
                interaction.followUp({ embeds: [embed] });
                return;
            }
            interaction.followUp({ content: "This is not a supported color!" });
            return;
        }
        return;
    }
}

function isColor(str: string) {
    var colors = [
        //Don't touch my color names!
        "aliceblue",
        "antiquewhite",
        "aqua",
        "aquamarine",
        "azure",
        "beige",
        "bisque",
        "black",
        "blanchedalmond",
        "blue",
        "blueviolet",
        "brown",
        "burlywood",
        "cadetblue",
        "chartreuse",
        "chocolate",
        "coral",
        "cornflowerblue",
        "cornsilk",
        "crimson",
        "cyan",
        "darkblue",
        "darkcyan",
        "darkgoldenrod",
        "darkgray",
        "darkgreen",
        "darkkhaki",
        "darkmagenta",
        "darkolivegreen",
        "darkorange",
        "darkorchid",
        "darkred",
        "darksalmon",
        "darkseagreen",
        "darkslateblue",
        "darkslategray",
        "darkturquoise",
        "darkviolet",
        "deeppink",
        "deepskyblue",
        "dimgray",
        "dodgerblue",
        "firebrick",
        "floralwhite",
        "forestgreen",
        "fuchsia",
        "gainsboro",
        "ghostwhite",
        "gold",
        "goldenrod",
        "gray",
        "green",
        "greenyellow",
        "honeydew",
        "hotpink",
        "indianred",
        "indigo",
        "ivory",
        "khaki",
        "lavender",
        "lavenderblush",
        "lawngreen",
        "lemonchiffon",
        "lightblue",
        "lightcoral",
        "lightcyan",
        "lightgoldenrodyellow",
        "lightgrey",
        "lightgreen",
        "lightpink",
        "lightsalmon",
        "lightseagreen",
        "lightskyblue",
        "lightslategray",
        "lightsteelblue",
        "lightyellow",
        "lime",
        "limegreen",
        "linen",
        "magenta",
        "maroon",
        "mediumaquamarine",
        "mediumblue",
        "mediumorchid",
        "mediumpurple",
        "mediumseagreen",
        "mediumslateblue",
        "mediumspringgreen",
        "mediumturquoise",
        "mediumvioletred",
        "midnightblue",
        "mintcream",
        "mistyrose",
        "moccasin",
        "navajowhite",
        "navy",
        "oldlace",
        "olive",
        "olivedrab",
        "orange",
        "orangered",
        "orchid",
        "palegoldenrod",
        "palegreen",
        "paleturquoise",
        "palevioletred",
        "papayawhip",
        "peachpuff",
        "peru",
        "pink",
        "plum",
        "powderblue",
        "purple",
        "rebeccapurple",
        "red",
        "rosybrown",
        "royalblue",
        "saddlebrown",
        "salmon",
        "sandybrown",
        "seagreen",
        "seashell",
        "sienna",
        "silver",
        "skyblue",
        "slateblue",
        "slategray",
        "snow",
        "springgreen",
        "steelblue",
        "tan",
        "teal",
        "thistle",
        "tomato",
        "turquoise",
        "violet",
        "wheat",
        "white",
        "whitesmoke",
        "yellow",
        "yellowgreen",
    ];
    if (colors.includes(str.toLowerCase())) return true;
    if (/^#[A-F0-9]{6}$/i.test(str)) return true;

    return false;
}
/** # RC help function
 * a useless function that i keep to reemember the usage
 * @Noro
 */
// function HelpEmbed(embed: MessageEmbed, client: DiscordClient) {
//     embed
//         .setTitle("rank card customization")
//         .setDescription(
//             `TrackColor/TextColor only supports [**Color Names: ||aqua||**](https://htmlcolorcodes.com/color-names/) and [**Hex Codes: ||#00FFFF||**](https://htmlcolorcodes.com/)
//         **Tip:** You can use **\`default\`** in the last value to reset it to the default and first value,
//         **Ex1:** *rc bg default*
//         **Ex2:** *rc textcolor default*`
//         )
//         .addField(
//             "background",
//             `**Usage:** rc bg <Upload Image>\n**Example:** rc bg [*Upload Image*](https://support.discord.com/hc/articles/211866427)`
//         )
//         .addField(
//             "opacity",
//             `**Usage:** rc opacity <0-100>\n **Example:** rc opacity 70`
//         )
//         .addField(
//             "Track Color",
//             `**Usage:** rc trackcolor <Color>\n **Example:** rc trackcolor #21cc87`
//         )
//         .addField(
//             "Text Color",
//             `**Usage:** rc textcolor <Color>\n **Example:** rc textcolor #554b58`
//         )
//         .setFooter(
//             "https://ko-fi.com/rohank05",
//             client.user!.displayAvatarURL()
//         );
//     return embed;
// }
