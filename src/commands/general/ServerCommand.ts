import { EmbedFieldData, Message, MessageEmbed } from "discord.js";
import DiscordClient from "../../client/client";
import { BaseCommand } from "../../utils/structures";

export default class ServerCommand extends BaseCommand {
    constructor() {
        super(
            "serverinfo",
            "Shows the info of the server where the command is writen in",
            "general",
            ["server"],
            "serverinfo",
            "serverinfo"
        );
    }
    async run(client: DiscordClient, message: Message, args: Array<string>) {
        var GuildOwner =
            `<@${message.guild?.ownerID}>` ||
            "not in cache <:sorry:762202529756872704>";
        const createdAt = new Intl.DateTimeFormat("en-US").format(
            message.guild?.createdAt
        );
        var embed = new MessageEmbed()
            .setThumbnail(message.guild!.iconURL({ dynamic: true })!)
            .setAuthor(message.guild!.name)
            .setColor(`#800080`)
            .addFields(
                {
                    name: `ID:`,
                    value: message.guild!.id.toString(),
                    inline: true,
                },
                { name: `Owner:`, value: GuildOwner, inline: true },
                {
                    name: `Created At:`,
                    value: createdAt.toString(),
                    inline: true,
                },
                {
                    name: `Member Count:`,
                    value: message.guild!.memberCount.toString(),
                    inline: true,
                },
                {
                    name: `Roles Count:`,
                    value: message.guild!.roles.cache.size.toString(),
                    inline: true,
                },
                {
                    name: `Channels Count`,
                    value: message.guild!.channels.cache.size.toString(),
                    inline: true,
                }
            )
            .setTimestamp()
            .setFooter(
                message.author.tag,
                message.author.displayAvatarURL({ dynamic: true })
            );
        checks(message, embed);
        message.reply({ embeds: [embed] });
    }
}
function checks(message: Message, embed: MessageEmbed) {
    if (!message.guild) return;
    if (message.guild.premiumSubscriptionCount) {
        embed.addFields(
            {
                name: "Boosters Count",
                value: message.guild.premiumSubscriptionCount.toString(),
                inline: true,
            },
            {
                name: `Boosting Level`,
                value: capitalizeFirstLetter(
                    message.guild.premiumTier.toLowerCase().replace("_", " ")
                ),
                inline: true,
            }
        );
    }
    if (message.guild.systemChannel) {
        embed.addField(
            `System Channel`,
            `<#${message.guild.systemChannel.id}>`,
            true
        );
    }
    if (message.guild.afkChannel) {
        embed.addField(
            `AFK Channel`,
            "**`" + message.guild.afkChannel.name + "`**",
            true
        );
    }
    if (message.guild.banner) {
        embed.addField(
            "Server's Banner",
            "[Press here](" + message.guild.bannerURL() + ")"
        );
    }
    if (message.guild.verified) {
        embed.addField(`Is Verified?`, "Yes", true);
    }
    if (message.guild.partnered) {
        embed.addField(`Is partnered?`, "Yes!", true);
    }
    if (message.guild.features) {
        var features = message.guild.features
            .map((f) => {
                var capedf = capitalizeFirstLetter(
                    f.toString().toLowerCase().replace(/_/g, " ")
                );
                return `**` + capedf + `**`;
            })
            .join(",\n");
        if (!features) return;
        embed.addField("Server's Features", features + ".", false);
    }
    if (message.guild.banner) {
        embed.setImage(message.guild.bannerURL({ format: "png" })!);
    }
}

function capitalizeFirstLetter(string: String) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
