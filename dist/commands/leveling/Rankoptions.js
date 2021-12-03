"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const levelingOperation_1 = require("../../database/functions/levelingOperation");
const config_1 = __importDefault(require("../../utils/config"));
const BaseCommand_1 = __importDefault(require("../../structures/BaseCommand"));
class RankOptionCommand extends BaseCommand_1.default {
    constructor() {
        super("rank-options", "Edit the rank card's data");
    }
    run(client, interaction) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            if (!interaction.guild)
                return;
            const GuildID = interaction.guild.id;
            const UserID = interaction.user.id;
            const embed = new discord_js_1.MessageEmbed();
            const GX = yield levelingOperation_1.getLevel((_a = interaction.guild) === null || _a === void 0 ? void 0 : _a.id);
            const UI = GX.users.findIndex((d) => {
                return d.user === UserID;
            });
            const choice = interaction.options
                .getString("option", true)
                .toLowerCase();
            const input = interaction.options.getString("input", false);
            if (UI < 0) {
                embed
                    .setColor("RED")
                    .setDescription("❌ I don't have any data for you at this moment. Kindly gain some XP first");
                interaction.followUp({ embeds: [embed] });
                return;
            }
            if (["help"].includes(choice)) {
                interaction.followUp({
                    embeds: [HelpEmbed(embed, client)],
                });
                return;
            }
            if (["bg"].includes(choice)) {
                if (!input) {
                    levelingOperation_1.updateUserBackground(UserID, GuildID, "https://cdn.discordapp.com/attachments/791301593391562752/856879146175954954/rankcard2.png");
                    embed
                        .setDescription(`The background is back to default: [Image](https://cdn.discordapp.com/attachments/791301593391562752/856879146175954954/rankcard2.png)`)
                        .setImage("https://cdn.discordapp.com/attachments/791301593391562752/856879146175954954/rankcard2.png");
                    interaction.followUp({ embeds: [embed] });
                    return;
                }
                if (!input.startsWith("https://i.imgur.com") ||
                    !input.startsWith("https://cdn.discord.com")) {
                    interaction.followUp({
                        content: `We only support https://i.imgur.com and https://cdn.discord.com links only`,
                    });
                    return;
                }
            }
            if (["op"].includes(choice)) {
                if (!input) {
                    levelingOperation_1.updateUserOpacity(UserID, GuildID, 0.7);
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
                levelingOperation_1.updateUserOpacity(UserID, GuildID, num / 100);
                interaction.followUp({ content: `Opacity is now **${num}%**` });
                return;
            }
            if (["track"].includes(choice)) {
                if (!input) {
                    levelingOperation_1.updateUserTrackColor(UserID, GuildID, "#21cc87");
                    interaction.followUp({
                        content: "Track color is back to default: `#21cc87`",
                    });
                    return;
                }
                if (isColor(input)) {
                    levelingOperation_1.updateUserTrackColor(UserID, GuildID, input);
                    embed
                        .setColor(input)
                        .setDescription(`Track color is now **${input}**`);
                    interaction.followUp({ embeds: [embed] });
                    return;
                }
                interaction.followUp({ content: "This is not a supported color!" });
                return;
            }
            if (["text"].includes(choice)) {
                if (!input) {
                    levelingOperation_1.updateUserTextColor(UserID, GuildID, "#f5deb3");
                    interaction.followUp({
                        content: "Text color is back to default: `#f5deb3`",
                    });
                    return;
                }
                if (isColor(input)) {
                    levelingOperation_1.updateUserTextColor(UserID, GuildID, input);
                    embed
                        .setColor(input)
                        .setDescription(`Text color is now colored with **${input}**`);
                    interaction.followUp({ embeds: [embed] });
                    return;
                }
                interaction.followUp({ content: "This is not a supported color!" });
                return;
            }
            return;
        });
    }
}
exports.default = RankOptionCommand;
function isColor(str) {
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
    if (colors.includes(str.toLowerCase()))
        return true;
    if (/^#[A-F0-9]{6}$/i.test(str))
        return true;
    return false;
}
/** # RC help function
 * a useless function that i keep to reemember the usage
 * @Noro
 */
function HelpEmbed(embed, client) {
    embed
        .setTitle("rank card customization")
        .setDescription(`TrackColor/TextColor only supports [**Color Names**](https://htmlcolorcodes.com/color-names/) and [**Hex Codes**](https://htmlcolorcodes.com/)
        **Tip:** You can leave \`input\` empty to reset it to the default value`)
        .addField("background", `**Usage:** \`option: bg\`, \`input: <Imgur or cdn.discord image link>\`\n**Example:** \`option: bg\`, \`input: https://cdn.discordapp.com/attachments/791301593391562752/856879146175954954/rankcard2.png\``)
        .addField("opacity", `**Usage:** \`options: op\`, \`input: <0-100>\`\n **Example:** \`options: op\`, \`input: 70\``)
        .addField("Track Color", `**Usage:** \`options: track\` \`input: <Color>\`\n **Example:** \`options: track\` \`input: #21cc87\``)
        .addField("Text Color", `**Usage:** rc textcolor <Color>\n **Example:** rc textcolor #554b58`)
        .setFooter(config_1.default.links.donate, client.user.displayAvatarURL());
    return embed;
}
