import {
    ButtonInteraction,
    CommandInteraction,
    Interaction,
    Message,
    MessageActionRow,
    MessageButton,
} from "discord.js";
import config from "../config";

export async function embedMaker(
    interaction: CommandInteraction,
    embeds: string | any[],
    page: number
) {
    const date = Date.now();
    const prev = `previous-${interaction.user.id}-${date}`;
    const next = `next-${interaction.user.id}-${date}`;
    const navbtns = new MessageActionRow().addComponents(
        new MessageButton()
            .setCustomId(prev)
            .setEmoji(config.emojis.arrowLeft)
            .setStyle("PRIMARY"),
        new MessageButton()
            .setCustomId(next)
            .setEmoji(config.emojis.arrowRight)
            .setStyle("PRIMARY")
    );
    const no_navbtn = new MessageActionRow().addComponents(
        new MessageButton()
            .setCustomId(prev)
            .setEmoji(config.emojis.arrowLeft)
            .setStyle("PRIMARY")
            .setDisabled(true),
        new MessageButton()
            .setCustomId(next)
            .setEmoji(config.emojis.arrowRight)
            .setStyle("PRIMARY")
            .setDisabled(true)
    );
    const navbtn_next = new MessageActionRow().addComponents(
        new MessageButton()
            .setCustomId(prev)
            .setEmoji(config.emojis.arrowLeft)
            .setStyle("PRIMARY")
            .setDisabled(true),
        new MessageButton()
            .setCustomId(next)
            .setEmoji(config.emojis.arrowRight)
            .setStyle("PRIMARY")
    );
    const navbtn_prev = new MessageActionRow().addComponents(
        new MessageButton()
            .setCustomId(prev)
            .setEmoji(config.emojis.arrowLeft)
            .setStyle("PRIMARY"),
        new MessageButton()
            .setCustomId(next)
            .setEmoji(config.emojis.arrowRight)
            .setStyle("PRIMARY")
            .setDisabled(true)
    );
    const message = await interaction.reply({
        embeds: [
            embeds[page].setFooter({
                text: `Page ${page + 1} of ${embeds.length} | ${
                    config.links.website
                }`,
            }),
        ],
        components: [navbtn_next],
        fetchReply: true,
    });
    const collector = (message as Message).createMessageComponentCollector({
        filter: (i) => i.user.id === interaction.user.id,
        time: 2 * 60 * 1000,
        componentType: "BUTTON",
    });
    collector.on("collect", InteractionCreateEventListener);
    collector.on("end", () => {
        interaction.editReply({ components: [no_navbtn] });
    });
    async function InteractionCreateEventListener(int: ButtonInteraction) {
        if (int.customId == prev) {
            if (page != 0) {
                page--;
                embeds[page].setFooter({
                    text: `Page ${page + 1} of ${embeds.length} | ${
                        config.links.website
                    }`,
                });
                if (page == 0) {
                    await int.update({
                        embeds: [embeds[page]],
                        components: [navbtn_next],
                    });
                    return;
                } else {
                    await int.update({
                        embeds: [embeds[page]],
                        components: [navbtns],
                    });
                    return;
                }
            }
        }
        if (int.customId == next) {
            if (page < embeds.length - 1) {
                page++;
                embeds[page].setFooter({
                    text: `Page ${page + 1} of ${embeds.length} | ${
                        config.links.website
                    }`,
                });
                if (page === embeds.length - 1) {
                    await int.update({
                        embeds: [embeds[page]],
                        components: [navbtn_prev],
                    });
                    return;
                } else {
                    await int.update({
                        embeds: [embeds[page]],
                        components: [navbtns],
                    });
                    return;
                }
            }
        }
        return;
    }
}
