import { CommandInteraction } from "discord.js";
import DiscordClient from "../../../client/client";
import { UpdateWelcome } from "../../../database/functions/GuildSettingsFunctions";
import CommandInt from "../../../structures/BaseCommand";
import { clean, CustomEmbed } from "../../../utils/functions/Custom";
import { CheckPerms } from "../../../utils/functions/mod";
import { updateCacheGuildSettings } from "../../../utils/initialFunctions";

const SettingsWelcomeChannel: CommandInt = {
    name: "settings welcome channel",
    description: "channel message",
    async run(
        client: DiscordClient,
        interaction: CommandInteraction<"cached">
    ) {
        if (
            !(await CheckPerms(
                interaction,
                interaction.user.id,
                "ADMINISTRATOR"
            ))
        ) {
            return;
        }
        let channel = interaction.options.getChannel("channel", true);
        let message = interaction.options.getString("message", false);
        const embed = new CustomEmbed(interaction)
            .setDescription("**Welcome Channel Settings Updated**")
            .addField("Channel", `${channel}`);
        if (message) {
            let test = message
                .replace(/{member}/g, `<@!${interaction.user.id}>`)
                .replace(/{server}/g, `**${clean(interaction.guild?.name)}**`)
                .replace(/\\new/gi, "\n");
            embed.addField("Message Demo", `\` ${test} \``);
        }

        await UpdateWelcome(interaction.guildId, {
            channelMessage: message,
            welcomeChannelID: channel.id,
        });
        await updateCacheGuildSettings(client, interaction.guildId);
        interaction.reply({
            embeds: [embed],
        });
    },
};

export default SettingsWelcomeChannel;
