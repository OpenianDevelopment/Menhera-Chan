import CommandInt from "../../structures/BaseCommand";
import DiscordClient from "../../client/client";
import {
    CommandInteraction,
    CommandInteractionOption,
    TextChannel,
} from "discord.js";
import { UpdateStarboard } from "../../database/functions/GuildSettingsFunctions";
import { CheckPerms } from "../../utils/functions/mod";
import config from "../../utils/config";
import { CustomEmbed } from "../../utils/functions/Custom";
import { updateCacheGuildSettings } from "../../utils/initialFunctions";

const SettingsStarBoardChannel: CommandInt = {
    name: "settings starboard",
    description: "Change Starboard's settings",
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
        const oldData = client.guildSettings.get(interaction.guildId);
        if (!oldData)
            return interaction.reply({
                content: "Guild has no settings cached",
            });
        let embeds: CustomEmbed[] = [];
        const minStars = interaction.options.getInteger("min-stars", false);
        const channel = interaction.options.getChannel("channel", false);
        if (!minStars && !channel)
            return interaction.reply({ content: "Change at least one object" });
        if (minStars) {
            embeds.push(await SetMinStars(interaction, minStars));
        }
        if (channel) {
            embeds.push(await SetChannel(client, interaction, channel));
            const embed = new CustomEmbed(interaction, false, false);
            (channel as TextChannel)
                .send({
                    embeds: [
                        embed.setDescription(
                            `${config.emojis.MenheraWave} Stared messages will be sent here!`
                        ),
                    ],
                })
                .catch(() => {
                    UpdateStarboard(interaction.guild.id, {
                        channelId: undefined,
                    });
                    embeds = embeds.filter(
                        (e) => !e.description?.includes(`<#${channel.id}>`)
                    );
                    embeds.push(
                        embed.setDescription(
                            `${config.emojis.redCrossMark} Configuration failed, process terminated.\nPlease recheck the bot's permissions`
                        )
                    );
                });
            await updateCacheGuildSettings(client, interaction.guildId);
        }
        return interaction.reply({ embeds: embeds });
    },
};

export default SettingsStarBoardChannel;

async function SetChannel(
    client: DiscordClient,
    interaction: CommandInteraction<"cached">,
    channel: NonNullable<CommandInteractionOption<"cached">["channel"]>
) {
    const embed = new CustomEmbed(interaction, false, false);
    if (!channel.isText() || channel.isThread()) {
        return embed.setDescription("Channel has to be a normal Text Channel");
    }
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
        return embed.setDescription(
            `${config.emojis.redCrossMark} I need **READ_MESSAGE_HISTORY, SEND_MESSAGES, ATTACH_FILES, EMBED_LINKS, ADD_REACTIONS and MANAGE_MESSAGES** permissions to be able to use that channel as the starboard.\nPlease give me those permissions.`
        );
    }
    try {
        await UpdateStarboard(interaction.guild.id, {
            channelId: channel.id,
        });
        return embed.setDescription(
            `Starboard channel has been set to <#${channel.id}>`
        );
    } catch {
        return embed.setDescription(
            `Command Errored Out, please check that i have the right permissions for that channel`
        );
    }
}

async function SetMinStars(
    interaction: CommandInteraction<"cached">,
    minStars: number
) {
    const embed = new CustomEmbed(interaction, false, false);
    if (minStars <= 1) {
        return embed.setDescription(
            "You can only set min-stars to numbers greater than one"
        );
    }
    await UpdateStarboard(interaction.guild.id, {
        minStars: minStars,
    });
    return embed.setDescription(
        `${config.emojis.whiteHeavyCheckMark} Minimun stars count to star a message has been increased to ${minStars}`
    );
}
