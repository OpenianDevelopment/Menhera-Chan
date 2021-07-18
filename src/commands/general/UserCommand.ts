import { Message, MessageEmbed, Snowflake } from "discord.js";
import DiscordClient from "../../client/client";
import { BaseCommand } from "../../utils/structures";

export default class UserCommand extends BaseCommand {
    constructor() {
        super(
            "whois",
            "To get user info",
            "general",
            ["userinfo", "ui"],
            "whois [user]",
            "ui 534783899331461123"
        );
    }
    async run(client: DiscordClient, message: Message, args: Array<string>) {
        if (!message.guild) return;
        var member =
            message.mentions.members!.first() ||
            (await message.guild.members.fetch(args[0] as Snowflake));
        if (!member.user) {
            if (!member) {
                message.reply({ content: "User not found" });
                return;
            }
            member = message.member!;
        }

        const joined = member.joinedAt!.toDateString();
        const created = member.user.createdAt.toDateString();
        const roles =
            member.roles.cache
                .filter((r) => r.id !== message.guild!.id)
                .map((r) => r)
                .join(", ") || "none";
        var roleslength = roles.split(",");
        const permission = member.permissions.toArray();

        var permissionString = "";
        permission.forEach((p) => {
            if (p === "PRIORITY_SPEAKER") {
                permissionString += "Priority Speaker, ";
            }
            if (p === "MUTE_MEMBERS") {
                permissionString += "Mute Members, ";
            }
            if (p === "MENTION_EVERYONE") {
                permissionString += "Mention Everyone, ";
            }
            if (p === "KICK_MEMBERS") {
                permissionString += "Kick Members, ";
            }
            if (p === "BAN_MEMBERS") {
                permissionString += "Ban Members, ";
            }
            if (p === "MANAGE_NICKNAMES") {
                permissionString += "Change Nicknames, ";
            }
            if (p === "MANAGE_EMOJIS") {
                permissionString += "Manage Emojis, ";
            }
            if (p === "MANAGE_MESSAGES") {
                permissionString += "Manage Messages, ";
            }
            if (p === "MANAGE_CHANNELS") {
                permissionString += "Manage Channels, ";
            }
            if (p === "MANAGE_ROLES") {
                permissionString += "Manage Roles, ";
            }
            if (p === "MANAGE_GUILD") {
                permissionString += "Manage Server, ";
            }
            if (p === "ADMINISTRATOR") {
                permissionString += "Administrator, ";
            }
        });
        permissionString = permissionString.slice(0, -2);

        const embed = new MessageEmbed()
            .setAuthor(
                member.user.username,
                member.user.displayAvatarURL({ dynamic: true })
            )
            .setDescription(`<@!${member.user.id}>`)
            .setColor("#7289DA")
            .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
            .addField("Joined", `${joined}\t`, true)
            .addField("Created", created, true)
            .addField("User ID", member.user.id)
            .setTimestamp()
            .setFooter(`https://www.menhera-chan.in/`);
        if (roles.length < 1024) {
            embed.addField(`Roles[${roleslength.length}]`, roles);
        } else {
            embed.addField(
                `Roles[${roleslength.length}]`,
                "Too Many roles to show"
            );
        }
        if (permissionString != "")
            embed.addField("Permissions", permissionString);

        message.reply({ embeds: [embed] });
    }
}
