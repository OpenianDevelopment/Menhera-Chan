import BaseInt from "../../structures/BaseCommand";
import DiscordClient from "../../client/client";

import { CommandInteraction } from "discord.js";
import { getGuildSettings } from "../../database/functions/GuildSettingsFunctions";
import { CheckPerms } from "../../utils/functions/mod";
import { clean, CustomEmbed } from "../../utils/functions/Custom";
import {
    AntispamSystemSettings,
    ExpSystemSettings,
    moderationSystemSettings,
    starboardSettings,
    welcomeSystemSettings,
} from "../../utils/interfaces/GlobalType";

export default class viewCommand extends BaseInt {
    constructor() {
        super("settings view", "to view settings");
    }
    async run(
        client: DiscordClient,
        interaction: CommandInteraction<"cached">
    ) {
        if (!(await CheckPerms(interaction, interaction.user.id, "ADMINISTRATOR"))) {
            return;
        }
        //make this in a more presentable format i don't care rn -julio
        //welp sadly i do, ~Noro
        const settings = await getGuildSettings(interaction.guildId);
        let exp: ExpSystemSettings = settings.expSettings;
        const expEmbed = new CustomEmbed(
            interaction,
            true,
            false
        ).setDescription("**Experience settings**");
        let antispam: AntispamSystemSettings = settings.antispamSettings;
        const antispamEmbed = new CustomEmbed(
            interaction,
            false,
            false
        ).setDescription("**Anti-Spam settings**");
        let moderation: moderationSystemSettings = settings.moderationSettings;
        const moderationEmbed = new CustomEmbed(
            interaction,
            false,
            false
        ).setDescription("**Moderation settings**");
        let welcome: welcomeSystemSettings = settings.welcomeSettings;
        const welcomeEmbed = new CustomEmbed(
            interaction,
            false,
            false
        ).setDescription("**Welcome settings**");
        let starboard: starboardSettings = settings.starboardSettings;
        const StarEmbed = new CustomEmbed(
            interaction,
            false,
            false
        ).setDescription("**Starboard settings**");
        if (exp.enable) {
            expEmbed.addFields(
                { name: "Enabled", value: "true" },
                {
                    name: "Exp Per Message",
                    value: exp.increment?.toString() || "No Increment Set",
                },
                {
                    name: "Time DIfference (In seconds)",
                    value:
                        (exp.timeDifference / 1000)?.toString() ||
                        "No Time DIfference Set",
                },
                {
                    name: "Blacklisted Channels",
                    value:
                        clean(
                            exp.blacklistChannel,
                            { start: "<#", end: ">" },
                            true
                        ) || "No Blacklisted Channels",
                },
                {
                    name: "Exp Log Channel",
                    value: exp.expLogChannel ? exp.expLogChannel : "No Channel",
                }
            );
        } else {
            expEmbed.addFields({ name: "Enabled", value: "false" });
        }
        if (antispam.enable) {
            antispamEmbed.addFields(
                { name: "Enabled", value: "true" },
                {
                    name: "Message Count",
                    value: antispam.messageCount?.toString() || "0",
                },
                {
                    name: "Time DIfference (In seconds)",
                    value:
                        (antispam.timeDifference / 1000)?.toString() ||
                        "No Time Difference Set",
                },
                {
                    name: "Antispam Channels",
                    value:
                        clean(
                            antispam.antispamChannel,
                            { start: "<#", end: ">" },
                            true
                        ) || "No Channel Set",
                },
                {
                    name: "Warn User",
                    value: antispam.warnUser?.toString(),
                },
                {
                    name: "Mute User",
                    value: antispam.muteUser?.toString(),
                },
                {
                    name: "Delete Message",
                    value: antispam.deleteMessage?.toString(),
                }
            );
        } else {
            antispamEmbed.addFields({ name: "Enabled", value: "false" });
        }
        if (moderation.enable) {
            moderationEmbed.addFields(
                { name: "Enabled", value: "true" },
                {
                    name: "Mod Log Channel",
                    value: moderation.modLogChannel
                        ? "<#" + moderation.modLogChannel + ">"
                        : "No Channel Set",
                },
                {
                    name: "Mod Blacklist Channels",
                    value:
                        clean(
                            moderation.modBlackList,
                            { start: "<#", end: ">" },
                            true
                        ) || "No Blacklisted Channels",
                },
                { name: "Block Urls", value: moderation.urlBlock?.toString() }
            );
            if (moderation.urlBlock) {
                moderationEmbed.addField(
                    "Whitelisted URLs",
                    clean(moderation.urlWhiteList) || "No Whitelisted URLs"
                );
            }
        } else {
            moderationEmbed.addFields({ name: "Enabled", value: "false" });
        }
        if (welcome.enable) {
            welcomeEmbed.addFields(
                { name: "Enabled", value: "true" },
                {
                    name: "Welcome Channel",
                    value: welcome.welcomeChannel?.toString() || "false",
                },
                {
                    name: "Welcome Channel Value",
                    value: welcome.welcomeChannelID
                        ? "<#" + welcome.welcomeChannelID + ">"
                        : "No Welcome Channel Set",
                },
                {
                    name: "Welcome Channel Message",
                    value: welcome.channelMessage
                        ? "`" + clean(welcome.channelMessage) + "`"
                        : "No Message Set",
                },
                {
                    name: "Welcome DM",
                    value: welcome.welcomeDM?.toString(),
                },
                {
                    name: "Welcome DM Message",
                    value: welcome.dmMessage
                        ? "`" + clean(welcome.dmMessage) + "`"
                        : "No DM set",
                },
                {
                    name: "Welcome Roles",
                    value:
                        clean(welcome.welcomeRoles, {
                            start: "<@&",
                            end: ">",
                        }) || "*Nothing*",
                }
            );
        } else {
            welcomeEmbed.addFields({ name: "Enabled", value: "false" });
        }
        if (starboard.enable) {
            StarEmbed.addFields(
                { name: "Enabled", value: "true" },
                {
                    name: "Starboard Channel",
                    value: starboard.channelId
                        ? `<#${starboard.channelId}>`
                        : "none",
                }
            );
        } else {
            StarEmbed.addFields({ name: "Enabled", value: "false" });
        }
        interaction.followUp({
            content: `${interaction.guild?.name}${
                interaction.guild!.name.endsWith("s") ? "'" : "'s"
            } Settings`,
            embeds: [
                expEmbed,
                antispamEmbed,
                moderationEmbed,
                welcomeEmbed,
                StarEmbed,
            ],
        });
    }
}
