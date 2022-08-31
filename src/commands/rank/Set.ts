import {
    CommandInteraction,
    MessageEmbed,
    ColorResolvable,
    CommandInteractionOption,
} from "discord.js";
import DiscordClient from "../../client/client";
import {
    getLevel,
    updateUserBackground,
    updateUserOpacity,
    updateUserTrackColor,
    updateUserTextColor,
} from "../../database/functions/levelingOperation";
import CommandInt from "../../structures/BaseCommand";
import config from "../../utils/config";

const RankSet: CommandInt = {
    name: "rank set",
    description: "Edit the rank card's data",
    async run(
        client: DiscordClient,
        interaction: CommandInteraction<"cached">
    ) {
        const GuildID = interaction.guild!.id;
        const UserID = interaction.user.id;
        const GX = await getLevel(interaction.guild?.id);
        const UI = GX.users.findIndex((d: any) => {
            return d.id === UserID;
        });
        if (UI < 0) {
            const embed = new MessageEmbed()
                .setColor("RED")
                .setDescription(
                    `${config.emojis.redCrossMark} I don't have any data for you at this moment. Kindly gain some XP first`
                );
            interaction.reply({ embeds: [embed] });
            return;
        }
        let embeds: MessageEmbed[] = [];
        let content = "";
        const options = interaction.options.data[0]!.options || [];
        let choices: (CommandInteractionOption | null)[] = [];
        for (let i = 0; i < options.length; i++) {
            choices.push(options[i]);
        }
        if (!choices || !options) {
            return client.commands.get("rank help")?.run(client, interaction);
        }
        choices.forEach((choice) => {
            const input = choice?.value?.toString();
            switch (choice?.name) {
                case "bg": {
                    //to avoid weird inputs
                    if (input?.toLowerCase().startsWith("default")) {
                        updateUserBackground(
                            UserID,
                            GuildID,
                            "https://cdn.discordapp.com/attachments/791301593391562752/856879146175954954/rankcard2.png"
                        );

                        embeds.push(
                            new MessageEmbed()
                                .setDescription(
                                    `The background is back to default: [Image](https://cdn.discordapp.com/attachments/791301593391562752/856879146175954954/rankcard2.png)`
                                )
                                .setImage(
                                    "https://cdn.discordapp.com/attachments/791301593391562752/856879146175954954/rankcard2.png"
                                )
                        );
                        return;
                    } else if (
                        !input ||
                        !/https:\/\/(i\.imgur\.com|cdn\.discordapp\.com)/.test(
                            input
                        )
                    ) {
                        content += `**\`Bg\`:** We only support https://i.imgur.com and https://cdn.discordapp.com links\n`;
                        return;
                    } else {
                        updateUserBackground(UserID, GuildID, input);
                        embeds.push(
                            new MessageEmbed()
                                .setDescription("Background image set to:")
                                .setImage(input)
                        );
                        return;
                    }
                }
                case "opacity": {
                    const num = Number(input);
                    if (num < 0) {
                        updateUserOpacity(UserID, GuildID, 0.7);
                        content +=
                            "**`Opacity`** is back to default: **70%**\n";
                        return;
                    } else if (!num || num > 100) {
                        content +=
                            "**`Opacity`:** This is not a number between **0** and **100**!\n";
                        return;
                    } else {
                        updateUserOpacity(UserID, GuildID, num / 100);
                        content += `**\`Opacity\`** is now **${num}%**\n`;
                        return;
                    }
                }
                case "track": {
                    if (input?.startsWith("default")) {
                        updateUserTrackColor(UserID, GuildID, "#21cc87");
                        content +=
                            "**`Track color`** is back to default: `#21cc87`\n";
                        return;
                    } else if (input && isColor(input)) {
                        updateUserTrackColor(UserID, GuildID, input);
                        embeds.push(
                            new MessageEmbed()
                                .setColor(input as ColorResolvable)
                                .setDescription(
                                    `Track color is now **${input}**`
                                )
                        );
                        return;
                    } else {
                        content +=
                            "**`Track color`:** This is not a supported color!\n";
                        return;
                    }
                }
                case "text": {
                    if (input?.startsWith("default")) {
                        updateUserTextColor(UserID, GuildID, "#f5deb3");
                        content +=
                            "**`Text color`** is back to default: `#f5deb3`\n";
                        return;
                    } else if (input && isColor(input)) {
                        updateUserTextColor(UserID, GuildID, input);
                        embeds.push(
                            new MessageEmbed()
                                .setColor(input as ColorResolvable)
                                .setDescription(
                                    `Text color is now colored with **${input}**`
                                )
                        );
                        return;
                    } else {
                        content +=
                            "**`Text color`:** This is not a supported color!\n";
                        return;
                    }
                }
                default:
                    return;
            }
        });
        interaction.reply({ content: content, embeds: embeds });
    },
};

function isColor(str: string) {
    const colors = [
        //Don't touch my color names!
        "DEFAULT",
        "WHITE",
        "AQUA",
        "GREEN",
        "BLUE",
        "YELLOW",
        "PURPLE",
        "LUMINOUS_VIVID_PINK",
        "FUCHSIA",
        "GOLD",
        "ORANGE",
        "RED",
        "GREY",
        "DARKER_GREY",
        "NAVY",
        "DARK_AQUA",
        "DARK_GREEN",
        "DARK_BLUE",
        "DARK_PURPLE",
        "DARK_VIVID_PINK",
        "DARK_GOLD",
        "DARK_ORANGE",
        "DARK_RED",
        "DARK_GREY",
        "LIGHT_GREY",
        "DARK_NAVY",
        "BLURPLE",
        "GREYPLE",
        "DARK_BUT_NOT_BLACK",
        "NOT_QUITE_BLACK",
        "RANDOM",
    ];
    if (colors.includes(str.toUpperCase().replace(/ /g, "_"))) return true;
    if (/^#[A-F0-9]{6}$/i.test(str)) return true;
    return false;
}

export default RankSet;
