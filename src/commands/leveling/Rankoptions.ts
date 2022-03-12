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
import { CustomEmbed } from "../../utils/functions/Custom";

export default class RankOptionCommand extends BaseCommand {
    constructor() {
        super("rank-options", "Edit the rank card's data");
    }

    async run(
        client: DiscordClient,
        interaction: CommandInteraction<"cached">
    ) {
        const GuildID = interaction.guild!.id;
        const UserID = interaction.user.id;
        const embed = new MessageEmbed();

        const GX = await getLevel(interaction.guild?.id);
        const UI = GX.users.findIndex((d: any) => {
            return d.user === UserID;
        });
        if (UI < 0) {
            embed
                .setColor("RED")
                .setDescription(
                    "❌ I don't have any data for you at this moment. Kindly gain some XP first"
                );
            interaction.followUp({ embeds: [embed] });
            return;
        }
        const choice = interaction.options.data[0];
        const input = choice.value?.toString();

        switch (choice.name) {
            case "help": {
                interaction.followUp({
                    embeds: [HelpEmbed(interaction, client)],
                });
                return;
            }
            case "bg": {
                //to avoid weird inputs
                if (input?.toLowerCase().startsWith("default")) {
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
                    !input?.startsWith("https://i.imgur.com") ||
                    !input?.startsWith("https://cdn.discord.com")
                ) {
                    interaction.followUp({
                        content: `We only support https://i.imgur.com and https://cdn.discord.com links only`,
                    });
                    return;
                }
                updateUserBackground(UserID, GuildID, input);
                interaction.followUp({
                    embeds: [
                        new MessageEmbed()
                            .setDescription("Background image set to:")
                            .setImage(input),
                    ],
                });
                return;
            }
            case "opacity": {
                const num = Number(input);
                if (num <= 0) {
                    updateUserOpacity(UserID, GuildID, 0.7);
                    interaction.followUp({
                        content: "Opacity is back to default: **70%**",
                    });
                    return;
                }
                if (!num || num > 100 || num < 0) {
                    interaction.followUp({
                        content:
                            "This is not a number between **0** and **100**!",
                    });
                    return;
                }
                updateUserOpacity(UserID, GuildID, num / 100);
                interaction.followUp({ content: `Opacity is now **${num}%**` });
                return;
            }
            case "track": {
                if (input?.startsWith("default")) {
                    updateUserTrackColor(UserID, GuildID, "#21cc87");
                    interaction.followUp({
                        content: "Track color is back to default: `#21cc87`",
                    });
                    return;
                }
                if (input && isColor(input)) {
                    updateUserTrackColor(UserID, GuildID, input);
                    embed
                        .setColor(input as ColorResolvable)
                        .setDescription(`Track color is now **${input}**`);
                    interaction.followUp({ embeds: [embed] });
                    return;
                }
                interaction.followUp({
                    content: "This is not a supported color!",
                });
                return;
            }
            case "text": {
                if (input?.startsWith("default")) {
                    updateUserTextColor(UserID, GuildID, "#f5deb3");
                    interaction.followUp({
                        content: "Text color is back to default: `#f5deb3`",
                    });
                    return;
                }
                if (input && isColor(input)) {
                    updateUserTextColor(UserID, GuildID, input);
                    embed
                        .setColor(input as ColorResolvable)
                        .setDescription(
                            `Text color is now colored with **${input}**`
                        );
                    interaction.followUp({ embeds: [embed] });
                    return;
                }
                interaction.followUp({
                    content: "This is not a supported color!",
                });
                return;
            }
            default:
                return;
        }
    }
}

function isColor(str: string) {
    const colors = [
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
