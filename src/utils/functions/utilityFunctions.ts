import {
    Message,
    MessageActionRow,
    MessageButton,
    MessageEmbed,
} from "discord.js";

export async function PagesInteraction(
    embeds: MessageEmbed[],
    message: Message
) {
    let currentPage = 0;
    const bothButton = new MessageActionRow().addComponents(
        new MessageButton()
            .setCustomID("previous")
            .setEmoji("⬅️")
            .setStyle("PRIMARY")
            .setLabel("Previous"),
        new MessageButton()
            .setCustomID("forward")
            .setEmoji("➡️")
            .setStyle("PRIMARY")
            .setLabel("Next")
    );
    const forwardButton = new MessageActionRow().addComponents(
        new MessageButton()
            .setCustomID("forward")
            .setStyle("PRIMARY")
            .setLabel("Next")
            .setEmoji("➡️")
    );
    const prevButton = new MessageActionRow().addComponents(
        new MessageButton()
            .setCustomID("previous")
            .setStyle("PRIMARY")
            .setEmoji("⬅️")
            .setLabel("Previous")
    );
    const PageEmbeds = await message.reply({
        content: `**Current Page - ${currentPage + 1}/${embeds.length}**`,
        embeds: [embeds[currentPage]],
        components: [forwardButton],
    });
    const filter = (m: any) => message.author.id === m.member.user.id;
    const collector = PageEmbeds.createMessageComponentInteractionCollector({
        filter,
        time: 60000,
    });
    collector.on("collect", async (interaction) => {
        if (interaction.customID === "forward") {
            if (currentPage < embeds.length - 1) {
                currentPage++;
                if (currentPage === embeds.length - 1) {
                    await interaction.update({
                        content: `**Current Page - ${currentPage + 1}/${
                            embeds.length
                        }**`,
                        embeds: [embeds[currentPage]],
                        components: [prevButton],
                    });
                } else {
                    await interaction.update({
                        content: `**Current Page - ${currentPage + 1}/${
                            embeds.length
                        }**`,
                        embeds: [embeds[currentPage]],
                        components: [bothButton],
                    });
                }
            }
        } else if (interaction.customID === "previous") {
            if (currentPage !== 0) {
                --currentPage;
                if (currentPage === 0) {
                    await interaction.update({
                        content: `**Current Page - ${currentPage + 1}/${
                            embeds.length
                        }**`,
                        embeds: [embeds[currentPage]],
                        components: [forwardButton],
                    });
                } else {
                    await interaction.update({
                        content: `**Current Page - ${currentPage + 1}/${
                            embeds.length
                        }**`,
                        embeds: [embeds[currentPage]],
                        components: [bothButton],
                    });
                }
            }
        }
    });
    collector.on("end", () => {
        PageEmbeds.edit({
            components: [],
        });
    });
}
