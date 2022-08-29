import CommandInt from "../../structures/BaseCommand";
import DiscordClient from "../../client/client";
import { CommandInteraction } from "discord.js";
import { UpdateExp } from "../../database/functions/GuildSettingsFunctions";
import { CheckPerms } from "../../utils/functions/mod";
import config from "../../utils/config";
import { CustomEmbed } from "../../utils/functions/Custom";
import { updateCacheGuildSettings } from "../../utils/initialFunctions";

const SettingsStarBoardChannel: CommandInt = {
    name: "settings exp",
    description: "Change Exp settings",
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
        let embeds: CustomEmbed[] = [];
        const oldData = client.guildSettings.get(interaction.guildId);
        if (!oldData)
            return interaction.reply({
                content: "Guild has no settings cached",
            });
        const increment = interaction.options.getInteger("increment", false);
        const timeDifference = interaction.options.getInteger(
            "exp-cooldown",
            false
        );
        const expLogChannel = interaction.options.getChannel(
            "log-channel",
            false
        );
        const addBlacklist = interaction.options.getChannel(
            "add-blacklist-channel",
            false
        );
        const removeBlacklist = interaction.options.getChannel(
            "remove-blacklist-channel",
            false
        );
        if (
            !increment &&
            !timeDifference &&
            !expLogChannel &&
            !addBlacklist &&
            !removeBlacklist
        )
            return interaction.reply({ content: "Change at least one object" });
        const embed = new CustomEmbed(interaction, false, false);
        //blacklisted channels
        if (addBlacklist && removeBlacklist) {
            embeds.push(
                embed.setDescription(
                    `${config.emojis.redCrossMark} You can't add and remove blacklist channels at the same time`
                )
            );
        } else if (addBlacklist && !removeBlacklist) {
            await UpdateExp(interaction.guildId, {
                blacklistChannel: [
                    ...oldData.expSettings.blacklistChannel,
                    addBlacklist.id,
                ],
            });
            embeds.push(
                embed.setDescription(
                    `Added <#${addBlacklist.id}> to the channels' blacklist`
                )
            );
        } else if (!addBlacklist && removeBlacklist) {
            await UpdateExp(interaction.guildId, {
                blacklistChannel: oldData.expSettings.blacklistChannel.filter(
                    (s) => s !== removeBlacklist.id
                ),
            });
            embeds.push(
                embed.setDescription(
                    `Removed <#${removeBlacklist.id}> from the channels' blacklist`
                )
            );
        }
        if (expLogChannel) {
            await UpdateExp(interaction.guildId, {
                expLogChannel: expLogChannel.id,
            });
            embeds.push(
                embed.setDescription(
                    `Set <#${expLogChannel.id}> as the new exp log channel`
                )
            );
        }
        if (timeDifference) {
            if (timeDifference < 1) {
                embeds.push(
                    embed.setDescription(
                        `\`exp-cooldown\` can only be greater than or equal **1 second**`
                    )
                );
            } else {
                await UpdateExp(interaction.guildId, {
                    timeDifference: timeDifference * 1000,
                });
                embeds.push(
                    embed.setDescription(
                        `\`exp-cooldown\` is now set to **${timeDifference} Second(s)**`
                    )
                );
            }
        }
        if (increment) {
            if (increment < 1 || increment >= 100) {
                embeds.push(
                    embed.setDescription(
                        `\`increment\` can only be **greater than or equal *1 exp* *and* less than *100 exp***`
                    )
                );
            } else {
                await UpdateExp(interaction.guildId, {
                    increment: increment,
                });
                embeds.push(
                    embed.setDescription(
                        `Members now gain **${increment} exp** per message (per cooldown)`
                    )
                );
            }
        }
        await updateCacheGuildSettings(client, interaction.guildId);
        return interaction.reply({ embeds: embeds });
    },
};

export default SettingsStarBoardChannel;
