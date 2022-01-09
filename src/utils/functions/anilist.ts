import {
    ButtonInteraction,
    CommandInteraction,
    Message,
    MessageActionRow,
    MessageButton
} from "discord.js";
import config from "../../utils/config";

export async function embed (interaction: CommandInteraction,embeds: string | any[],page: number){
    const navbtns = new MessageActionRow().addComponents(
        new MessageButton()
            .setCustomId("previous")
            .setEmoji("⬅️")
            .setStyle("PRIMARY"),
        new MessageButton()
            .setCustomId("next")
            .setEmoji("➡️")
            .setStyle("PRIMARY")
    );
    const navbtn_next = new MessageActionRow().addComponents(
        new MessageButton()
            .setCustomId("previous")
            .setEmoji("⬅️")
            .setStyle("PRIMARY")
            .setDisabled(true),
        new MessageButton()
            .setCustomId("next")
            .setEmoji("➡️")
            .setStyle("PRIMARY")
    );
    const navbtn_prev = new MessageActionRow().addComponents(
        new MessageButton()
            .setCustomId("previous")
            .setEmoji("⬅️")
            .setStyle("PRIMARY"),
        new MessageButton()
            .setCustomId("next")
            .setEmoji("➡️")
            .setStyle("PRIMARY")
            .setDisabled(true)
    );
    const botmsg = (await interaction.followUp({
        embeds: [embeds[page]],
        components: [navbtn_next],
    })) as Message;
    const filter = (int: any) =>
        (int.customId == "next" || int.customId == "previous") &&
        int.user.id == interaction.user.id;
    const collector = botmsg.createMessageComponentCollector({
        filter,
        time: 120000,
    });
    collector.on("collect", async (int: ButtonInteraction) => {
        await int.deferUpdate({});
        if (int.customId == `previous`) {
            if (page != 0) {
                page--;
                embeds[page].setFooter(
                    `Page ${page + 1} of ${embeds.length} | ${
                        config.links.website
                    }`
                );
                if (page == 0) {
                    await int.editReply({
                        embeds: [embeds[page]],
                        components: [navbtn_next],
                    });
                    return;
                } else {
                    await int.editReply({
                        embeds: [embeds[page]],
                        components: [navbtns],
                    });
                    return;
                }
            }
        }
        if (int.customId == `next`) {
            if (page < embeds.length - 1) {
                page++;
                embeds[page].setFooter(
                    `Page ${page + 1} of ${embeds.length} | ${
                        config.links.website
                    }`
                );
                if (page === embeds.length - 1) {
                    await int.editReply({
                        embeds: [embeds[page]],
                        components: [navbtn_prev],
                    });
                    return;
                } else {
                    await int.editReply({
                        embeds: [embeds[page]],
                        components: [navbtns],
                    });
                    return;
                }
            }
        }
    });
}