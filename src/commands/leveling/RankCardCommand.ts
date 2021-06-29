import { Message, MessageEmbed } from "discord.js";
import DiscordClient from "../../client/client";
import {
  getLevel,
  updateUserBackground,
  updateUserOpacity,
  updateUserTrackColor,
  updateUserTextColor,
} from "../../database/functions/levelingOperation";

import { BaseCommand } from "../../utils/structures";

export default class RankCardCommand extends BaseCommand {
  constructor() {
    super(
      "rankcard",
      "Edit the rank card's data",
      "leveling",
      ["rc"],
      "rankcard <data> <value>",
      "rc opacity 70"
    );
  }

  async run(client: DiscordClient, message: Message, args: Array<string>) {
    const GuildID = message.guild!.id;
    const UserID = message.author.id;
    const embed = new MessageEmbed();

    const GX = await getLevel(message.guild?.id);
    const UI = GX.users.findIndex((d) => {
      return d.user === UserID;
    });
    const helpEmbed = HelpEmbed(new MessageEmbed(), client);

    if (UI < 0) {
      embed
        .setColor("RED")
        .setDescription(
          "❌ I don't have any data on you at this moment. Kindly gain some XP first"
        );
      message.reply({ embeds: [embed] });
      return;
    }
    if (!args[0]) {
      message.reply({ embeds: [helpEmbed] });
      return;
    }
    if (args[0].toLowerCase() === "bg") {
      if (args[1] !== undefined && args[1].toLowerCase() === "default") {
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
        message.reply({ embeds: [embed] });
        return;
      }
      const Attachment = message.attachments.first();
      if (!Attachment) {
        embed.setDescription(
          `Go check how to [Upload Images](https://support.discord.com/hc/articles/211866427)`
        );
        message.reply({ embeds: [embed] });

        return;
      }
      if (
        Attachment.name?.endsWith("png") ||
        Attachment.name?.endsWith("jpg")
      ) {
        updateUserBackground(UserID, GuildID, Attachment.url);
        embed
          .setDescription(
            `This [Image](${Attachment.url}) is going to be the rank card's background`
          )
          .setImage(Attachment.url);
        message.reply({ embeds: [embed] });
        return;
      }
      embed.setDescription(
        `You need to [Upload An Image](https://support.discord.com/hc/articles/211866427) with **.PNG**/**.JPG** format`
      );
      message.reply({ embeds: [embed] });
      return;
    }
    if (args[0].toLowerCase() === "opacity") {
      if (args[1] !== undefined && args[1].toLowerCase() === "default") {
        updateUserOpacity(UserID, GuildID, 0.7);
        message.reply("Opacity is back to default: **70%**");
        return;
      }
      const num = parseInt(args[1]);
      if (!num || num > 100 || num < 0) {
        message.reply("This is not a number between **0** and **100**!");
        return;
      }
      updateUserOpacity(UserID, GuildID, num / 100);
      message.reply(`Opacity is now **${num}%**`);
      return;
    }
    if (args[0].toLowerCase() === "trackcolor") {
      if (args[1] !== undefined && args[1].toLowerCase() === "default") {
        updateUserTrackColor(UserID, GuildID, "#21cc87");
        message.reply("Track color is back to default: `#21cc87`");
        return;
      }
      if (args[1] !== undefined && isColor(args[1])) {
        updateUserTrackColor(UserID, GuildID, args[1].toLowerCase());
        embed
          .setColor(args[1].toLowerCase())
          .setDescription(`Track color is now **${args[1]}**`);
        message.reply({ embeds: [embed] });
        return;
      }
      message.reply("This is not a supported color!");
      return;
    }
    if (args[0].toLowerCase() === "textcolor") {
      if (args[1] !== undefined && args[1].toLowerCase() === "default") {
        updateUserTextColor(UserID, GuildID, "#f5deb3");
        message.reply("Text color is back to default: `#f5deb3`");
        return;
      }
      if (args[1] !== undefined && isColor(args[1])) {
        updateUserTextColor(UserID, GuildID, args[1].toLowerCase());
        embed
          .setColor(args[1].toLowerCase())
          .setDescription(`Text color is now **${args[1]}**`);
        message.reply({ embeds: [embed] });
        return;
      }
      message.reply("This is not a supported color!");
      return;
    }

    message.reply({ embeds: [helpEmbed] });
    return;
  }
}

function isColor(str: string) {
  str = str.toLowerCase();
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
  if (colors.includes(str)) return true;
  if (/#[A-F0-9]{6}/i.test(str)) return true;

  return false;
}

function HelpEmbed(embed: MessageEmbed, client: DiscordClient) {
  embed
    .setTitle("rank card customization")
    .setDescription(
      `TrackColor/TextColor only supports [**Color Names: ||aqua||**](https://htmlcolorcodes.com/color-names/) and [**Hex Codes: ||#00FFFF||**](https://htmlcolorcodes.com/)
        **Tip:** You can use **\`default\`** in the last value to reset it to the default and first value,
        **Ex1:** *rc bg default*
        **Ex2:** *rc textcolor default*`
    )
    .addField(
      "background",
      `**Usage:** rc bg <Upload Image>\n**Example:** rc bg [*Upload Image*](https://support.discord.com/hc/articles/211866427)`
    )
    .addField(
      "opacity",
      `**Usage:** rc opacity <0-100>\n **Example:** rc opacity 70`
    )
    .addField(
      "Track Color",
      `**Usage:** rc trackcolor <Color>\n **Example:** rc trackcolor #21cc87`
    )
    .addField(
      "Text Color",
      `**Usage:** rc textcolor <Color>\n **Example:** rc textcolor #554b58`
    )
    .setFooter("https://ko-fi.com/rohank05", client.user!.displayAvatarURL());
  return embed;
}
