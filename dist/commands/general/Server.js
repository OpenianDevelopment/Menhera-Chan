"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const BaseCommand_1 = __importDefault(require("../../structures/BaseCommand"));
const Custom_1 = require("../../utils/functions/Custom");
class ServerCommand extends BaseCommand_1.default {
    constructor() {
        super("serverinfo", "Shows the info of the server where the command is writen in");
    }
    run(client, interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!interaction.guild)
                return;
            var GuildOwner = `<@${interaction.guild.ownerId}>` ||
                "not in cache <:sorry:762202529756872704>";
            var createdAt = interaction.guild.createdTimestamp.toString();
            createdAt =
                "<t:" + createdAt.substring(0, createdAt.length - 3) + ":d>";
            var embed = new discord_js_1.MessageEmbed()
                .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
                .setAuthor(interaction.guild.name)
                .setColor(`#800080`)
                .addFields({
                name: `ID:`,
                value: interaction.guild.id.toString(),
                inline: true,
            }, { name: `Owner:`, value: GuildOwner, inline: true }, {
                name: `Created At:`,
                value: createdAt,
                inline: true,
            }, {
                name: `Member Count:`,
                value: interaction.guild.memberCount.toString(),
                inline: true,
            }, {
                name: `Roles Count:`,
                value: interaction.guild.roles.cache.size.toString(),
                inline: true,
            }, {
                name: `Channels Count`,
                value: interaction.guild.channels.cache.size.toString(),
                inline: true,
            })
                .setTimestamp()
                .setFooter(interaction.user.tag, interaction.user.displayAvatarURL({ dynamic: true }));
            checks(interaction, embed);
            interaction.followUp({ embeds: [embed] });
        });
    }
}
exports.default = ServerCommand;
function checks(interaction, embed) {
    if (!interaction.guild)
        return;
    if (interaction.guild.premiumSubscriptionCount) {
        embed.addFields({
            name: "Boosters Count",
            value: interaction.guild.premiumSubscriptionCount.toString(),
            inline: true,
        }, {
            name: `Boosting Level`,
            value: Custom_1.capFirstLetter(interaction.guild.premiumTier
                .toLowerCase()
                .replace("_", " ")),
            inline: true,
        });
    }
    if (interaction.guild.systemChannel) {
        embed.addField(`System Channel`, `<#${interaction.guild.systemChannel.id}>`, true);
    }
    if (interaction.guild.afkChannel) {
        embed.addField(`AFK Channel`, "**`" + interaction.guild.afkChannel.name + "`**", true);
    }
    if (interaction.guild.banner) {
        embed.addField("Server's Banner", "[Press here](" + interaction.guild.bannerURL() + ")");
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
            var capedf = Custom_1.capFirstLetter(f.toString().toLowerCase().replace(/_/g, " "));
            return `**` + capedf + `**`;
        })
            .join(",\n");
        if (!features)
            return;
        embed.addField("Server's Features", features + ".", false);
    }
    if (interaction.guild.banner) {
        embed.setImage(interaction.guild.bannerURL({ format: "png" }));
    }
}
