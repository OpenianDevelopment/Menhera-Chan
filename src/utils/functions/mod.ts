import DiscordClient from "../../client/client";
import { MessageEmbed, PermissionString, TextChannel } from "discord.js";
import { CommandInteraction } from "discord.js";
import { clean } from "./Custom";

export async function CheckPerms(
    interaction: CommandInteraction,
    userID: string | undefined,
    perms: PermissionString | Array<PermissionString>
) {
    if (userID == undefined || null) {
        return false;
    }
    let member = await interaction.guild?.members.fetch(userID);
    if (member == undefined || null) return false;
    if (member?.permissions.has(perms)) {
        return true;
    }
    return false;
}
export async function CheckPermsBoth(
    interaction: CommandInteraction,
    perms: PermissionString | Array<PermissionString>
) {
    let member = await interaction.guild?.members.fetch(interaction.user.id);
    let bot = await interaction.guild?.members.fetch(
        interaction.client.user!.id
    );
    if (!member?.permissions.has(perms)) {
        interaction.followUp({
            content: `You don't have permission to do this, you need:\
            \n${clean(perms)}`,
        });
        return false;
    }
    if (!bot?.permissions.has(perms)) {
        interaction.followUp({
            content: `I don't have the permission required to do this:\n${clean(
                perms
            )}`,
        });
        return false;
    }
    return true;
}
export async function ModLog(
    client: DiscordClient,
    guildID: string,
    embed: MessageEmbed
) {
    const guildOption = client.guildSettings.get(guildID);
    if (!guildOption?.moderationSettings?.enable) return;
    if (!guildOption?.moderationSettings?.modLogChannel) return;
    const guild = await client.guilds.fetch(guildID);
    const Modchannel = (await guild.channels.fetch(
        guildOption?.moderationSettings?.modLogChannel
    )) as TextChannel;
    if (!Modchannel) return;
    embed.setTimestamp();
    Modchannel.send({ embeds: [embed] });
}
