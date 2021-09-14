import { guildSettings } from "../schemas";

export async function getGuildSettings(guild_id: string) {
    const result = await guildSettings.findOne({ guild_id });
    return result;
}

export async function addGuildSettings(guild_id: string) {
    const newGuild = new guildSettings({
        guild_id: guild_id,
        antiSpamModule: false,
        expModule: false,
        newsModule: false,
        welcomeModule: false,
    });

    newGuild.save().catch(console.error);
}

export async function removeGuildSettings(guild_id: string) {
    guildSettings.findOneAndRemove({ guild_id }).catch(console.error);
}