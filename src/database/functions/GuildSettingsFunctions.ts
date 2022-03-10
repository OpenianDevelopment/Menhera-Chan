import { rawGuildSettings } from "../../utils/interfaces/GlobalType";
import { guildSettings } from "../schemas";
function GuildScheme(guildID: string) {
    return new guildSettings({
        guild_id: guildID,
        expSettings: {
            enable: false,
            increment: 1,
            timeDifference: 8000,
            blacklistChannel: [],
            expLogChannel: "",
        },
        antiSpamSettings: {
            enable: false,
            messageCount: 0,
            timeDifference: 3000,
            antispamChannel: [],
            warnUser: false,
            muteUser: false,
            deleteMessage: false,
        },
        moderationSettings: {
            enable: false,
            modLogChannel: "",
            modBlackList:[],
            urlBlock:false,
            urlWhiteList:[]
        },
        welcomeSettings: {
            enable: false,
            welcomeDM: false,
            welcomeChannel: false,
            welcomeChannelID: "",
            channelMessage: "",
            dmMessage:"",
            welcomeRoles: [],
        },
    });
}

export async function getGuildSettings(guild_id: string) {
    const result = await guildSettings.findOne({ guild_id });
    if (!result) {
        const newGuild = GuildScheme(guild_id);
        newGuild.save().catch(console.error);
        return newGuild as rawGuildSettings;
    }
    return result as rawGuildSettings;
}

export async function addGuildSettings(guild_id: string) {
    if (await guildSettings.findOne({ guild_id })) {
        return;
    }
    const newGuild = GuildScheme(guild_id);

    newGuild.save().catch(console.error);
}

export async function removeGuildSettings(guild_id: string) {
    guildSettings.findOneAndRemove({ guild_id }).catch(console.error);
}
