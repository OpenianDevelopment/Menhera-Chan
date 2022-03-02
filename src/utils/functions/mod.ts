import { PermissionResolvable, PermissionString } from "discord.js";
import { CommandInteraction } from "discord.js";

export async function CheckPerms(
    interaction: CommandInteraction,
    userID: string | undefined,
    perms: PermissionResolvable | Array<PermissionResolvable>
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
    perms: PermissionString
) {
    let member = await interaction.guild?.members.fetch(interaction.user.id);
    let bot = await interaction.guild?.members.fetch(
        interaction.client.user!.id
    );
    if (!member?.permissions.has(perms)) {
        interaction.followUp({
            content: `You don't have permission to do this, you need:\n**${perms}**`,
        });
        return false;
    }
    if (!bot?.permissions.has(perms)) {
        interaction.followUp({
            content: `Permission required to do this:\n**${perms}**`,
        });
        return false;
    }
    return true;
}
