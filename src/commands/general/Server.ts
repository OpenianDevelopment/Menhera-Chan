import DiscordClient from "../../client/client";
import { CommandInteraction, MessageEmbed } from "discord.js";
import BaseCommand from "../../structures/BaseCommand";
import { capFirstLetter } from "../../utils/functions/Custom";

export default class ServerCommand extends BaseCommand {
    constructor() {
        super(
            "serverinfo",
            "Shows the info of the server where the command is writen in"
        );
    }
    async run(client: DiscordClient, interaction: CommandInteraction) {
        if (!interaction.guild) return;
        var GuildOwner =
            `<@${interaction.guild.ownerId}>` ||
            "not in cache <:sorry:762202529756872704>";
        var createdAt = interaction.guild!.createdTimestamp.toString()!;
        createdAt =
            "<t:" + createdAt.substring(0, createdAt.length - 3) + ":d>";
        var embed = new MessageEmbed()
            .setThumbnail(interaction.guild!.iconURL({ dynamic: true })!)
            .setAuthor({name:interaction.guild.name})
            .setColor(`#800080`)
            .addFields(
                {
                    name: `ID:`,
                    value: interaction.guild.id.toString(),
                    inline: true,
                },
                { name: `Owner:`, value: GuildOwner, inline: true },
                {
                    name: `Created At:`,
                    value: createdAt,
                    inline: true,
                },
                {
                    name: `Member Count:`,
                    value: interaction.guild.memberCount.toString(),
                    inline: true,
                },
                {
                    name: `Roles Count:`,
                    value: interaction.guild.roles.cache.size.toString(),
                    inline: true,
                },
                {
                    name: `Channels Count`,
                    value: interaction.guild.channels.cache.size.toString(),
                    inline: true,
                }
            )
            .setTimestamp()
            .setFooter({
                text:interaction.user.tag,
                iconURL:interaction.user.displayAvatarURL({ dynamic: true })}
            );
        checks(interaction, embed);
        interaction.followUp({ embeds: [embed] });
    }
}
function checks(interaction: CommandInteraction, embed: MessageEmbed) {
    if (!interaction.guild) return;
    if (interaction.guild.premiumSubscriptionCount) {
        embed.addFields(
            {
                name: "Boosters Count",
                value: interaction.guild.premiumSubscriptionCount.toString(),
                inline: true,
            },
            {
                name: `Boosting Level`,
                value: capFirstLetter(
                    interaction.guild.premiumTier
                        .toLowerCase()
                        .replace("_", " ")
                ),
                inline: true,
            }
        );
    }
    if (interaction.guild.systemChannel) {
        embed.addField(
            `System Channel`,
            `<#${interaction.guild.systemChannel.id}>`,
            true
        );
    }
    if (interaction.guild.afkChannel) {
        embed.addField(
            `AFK Channel`,
            "**`" + interaction.guild.afkChannel.name + "`**",
            true
        );
    }
    if (interaction.guild.banner) {
        embed.addField(
            "Server's Banner",
            "[Press here](" + interaction.guild.bannerURL() + ")"
        );
    }
    if (interaction.guild.verified) {
        embed.addField(`Is Verified?`, "Yes", true);
    }
    if (interaction.guild.partnered) {
        embed.addField(`Is partnered?`, "Yes!", true);
    }
    if (interaction.guild.features) {
        var features = interaction.guild.features
            .map((f) => {
                var capedf = capFirstLetter(
                    f.toString().toLowerCase().replace(/_/g, " ")
                );
                return `**` + capedf + `**`;
            })
            .join(",\n");
        if (!features) return;
        embed.addField("Server's Features", features + ".", false);
    }
    if (interaction.guild.banner) {
        embed.setImage(interaction.guild.bannerURL({ format: "png" })!);
    }
}
