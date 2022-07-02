import { GuildMember, MessageEmbed } from "discord.js";
import DiscordClient from "../../client/client";
import config from "../config";

export async function sendLog(
    client: DiscordClient,
    InviteChannel: string | null,
    member: GuildMember
) {
    if (!member.guild.me?.permissions.has("MANAGE_GUILD")) return;
    if (!InviteChannel) return;
    const inviteLog = client.channels.cache.get(InviteChannel);
    if (!inviteLog || inviteLog.type !== "GUILD_TEXT") return;
    if (!inviteLog.permissionsFor(client.user!.id)?.has(`SEND_MESSAGES`))
        return;
    if (!inviteLog.permissionsFor(client.user!.id)?.has(`EMBED_LINKS`))
        return inviteLog.send({
            content: "Please provide Permission to send embed links",
        });
    const cachedInvites = client.getInvites(member.guild.id);
    const newInvites = await member.guild.invites.fetch({ cache: false });
    client.invites.set(
        member.guild.id,
        newInvites.map((v) => v)
    );
    const usedInvite = newInvites?.find(
        (inv) =>
            (inv.uses || 0) >
            (cachedInvites?.find((i) => i.code === inv.code)?.uses || 0)
    );
    const embed = new MessageEmbed()
        .setAuthor({
            name: `Member Joined`,
            iconURL: member.user.displayAvatarURL(),
            url: config.links.donate,
        })
        .setDescription(`${member} | ${member.user.tag} | ${member.user.id}`);
    if (!usedInvite || !usedInvite.inviter) {
        embed
            .addField("Inviter", "Not Found", false)
            .setColor("RED")
            .addField(
                "Invite Code",
                "None of the invites have changed. Perhaps this member joined using a guilds.join connection? or Invite is created from the channel i don't have access to.",
                true
            );
    } else {
        embed
            .addField(
                "Inviter",
                `${usedInvite.inviter.tag} | ${usedInvite.inviter.id}`,
                false
            )
            .setColor("GREEN")
            .addField("code", `**\`${usedInvite.code}\`**`, true)
            .addField("Uses", `${usedInvite.uses || 0}`, true);
    }
    inviteLog.send({ embeds: [embed] }).catch(() => {});
}
