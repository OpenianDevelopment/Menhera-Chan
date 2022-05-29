import BaseInt from "../../../structures/BaseCommand";
import DiscordClient from "../../../client/client";
import { CommandInteraction } from "discord.js";
import { UpdateStarboard } from "../../../database/functions/GuildSettingsFunctions";
import { CheckPerms } from "../../../utils/functions/mod";
import config from "../../../utils/config";
import { CustomEmbed } from "../../../utils/functions/Custom";
import { updateCacheGuildSettings } from "../../../utils/initialFunctions";

export default class enableDisableCommand extends BaseInt {
    constructor() {
        super("settings starboard", "toggles a feature");
    }
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
        const channel = interaction.options.getChannel("channel", true);
        if (!channel.isText() || channel.isThread()) {
            await interaction.followUp({
                content: "Channel has to be a normal Text Channel",
            });
            return;
        }
        const embed = new CustomEmbed(interaction, false, false);
        if (
            !channel
                .permissionsFor(client.user!.id)
                ?.has([
                    "READ_MESSAGE_HISTORY",
                    "SEND_MESSAGES",
                    "ATTACH_FILES",
                    "EMBED_LINKS",
                    "ADD_REACTIONS",
                    "MANAGE_MESSAGES",
                ])
        ) {
            await interaction.followUp({
                embeds: [
                    embed.setDescription(
                        `${config.emojis.redCrossMark} I need **READ_MESSAGE_HISTORY, SEND_MESSAGES, ATTACH_FILES, EMBED_LINKS, ADD_REACTIONS and MANAGE_MESSAGES** permissions to be able to use that channel as the starboard.\nPlease give me those permissions.`
                    ),
                ],
            });
            return;
        }
        try {
            await UpdateStarboard(interaction.guild.id, {
                channelId: channel.id,
            });
            interaction.followUp({
                content: `Starboard channel has been set to <#${channel.id}>`,
            });
            channel
                .send({
                    embeds: [
                        embed.setDescription(
                            `${config.emojis.MenheraWave} Stared messages will be sent here!`
                        ),
                    ],
                })
                .catch(async (err) => {
                    UpdateStarboard(interaction.guild.id, {
                        channelId: undefined,
                    });
                    await interaction.followUp({
                        embeds: [
                            embed.setDescription(
                                `${config.emojis.redCrossMark} Configuration failed, process terminated.\nPlease recheck thee permissions`
                            ),
                        ],
                    });
                });
            await updateCacheGuildSettings(client, interaction.guildId);
            return;
        } catch {
            await interaction.followUp({
                content: `Command Errored Out, please check that i have the right permissions for that channel`,
            });
            return;
        }
    }
}
