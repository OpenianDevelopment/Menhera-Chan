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
            expLogChannel: null,
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
            modLogChannel: null,
            modBlackList: [],
            urlBlock: false,
            urlWhiteList: [],
        },
        welcomeSettings: {
            enable: false,
            welcomeDM: false,
            welcomeChannel: false,
            welcomeChannelID: null,
            channelMessage: "Welcome {member} to {server}!",
            dmMessage: "Welcome {member} to {server}!",
            welcomeRoles: [],
            CustomWelcomeBackground:null,
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

export async function UpdateWelcome(
    guildID: string,
    data: {
        enable?: boolean;
        welcomeDM?: boolean;
        welcomeChannel?: boolean;
        welcomeChannelID?: string | null;
        channelMessage?: string | null;
        dmMessage?: string | null;
        welcomeRoles?: Array<string>;
        CustomWelcomeBackground?: string | null;
    }
) {
    let guildData: rawGuildSettings | null = await guildSettings.findOne({
        guild_id: guildID,
    });
    if (!guildData) return;
    let Settings = guildData?.welcomeSettings;
    if (data.enable == undefined) {
        data.enable = Settings.enable;
    }
    if (data.welcomeDM == undefined) {
        data.welcomeDM = Settings.welcomeDM;
    }
    if (data.welcomeChannel == undefined) {
        data.welcomeChannel = Settings.welcomeChannel;
    }
    if (data.welcomeChannelID == undefined) {
        data.welcomeChannelID = Settings.welcomeChannelID;
    }
    if (data.channelMessage == undefined) {
        data.channelMessage = Settings.channelMessage;
    }
    if (data.dmMessage == undefined) {
        data.dmMessage = Settings.dmMessage;
    }
    if (data.welcomeRoles == undefined) {
        data.welcomeRoles = Settings.welcomeRoles;
    }
    if (data.CustomWelcomeBackground == undefined) {
        data.CustomWelcomeBackground = Settings.CustomWelcomeBackground;
    }
    await guildSettings.updateOne(
        { guild_id: guildID },
        { welcomeSettings: data }
    );
}
export async function UpdateAntispam(
    guildID: string,
    data: {
        enable?: boolean;
        messageCount?: number;
        timeDifference?: number;
        antispamChannel?: Array<string>;
        warnUser?: boolean;
        muteUser?: boolean;
        deleteMessage?: boolean;
    }
) {
    let guildData: rawGuildSettings | null = await guildSettings.findOne({
        guild_id: guildID,
    });
    if (!guildData) return;
    let Settings = guildData.antispamSettings;
    if (data.enable == undefined) {
        data.enable = Settings.enable;
    }
    if (data.messageCount == undefined) {
        data.messageCount = Settings.messageCount;
    }
    if (data.timeDifference == undefined) {
        data.timeDifference = Settings.timeDifference;
    }
    if (data.antispamChannel == undefined) {
        data.antispamChannel = Settings.antispamChannel;
    }
    if (data.warnUser == undefined) {
        data.warnUser = Settings.warnUser;
    }
    if (data.muteUser == undefined) {
        data.muteUser = Settings.muteUser;
    }
    if (data.deleteMessage == undefined) {
        data.deleteMessage = Settings.deleteMessage;
    }

    await guildSettings.findOneAndUpdate(
        { guild_id: guildID },
        { antiSpamSettings: data }
    );
}
export async function UpdateModeration(
    guildID: String,
    data: {
        enable?: boolean;
        modLogChannel?: string | null;
        modBlackList?: Array<string>;
        urlBlock?: boolean;
        urlWhiteList?: Array<string>;
    }
) {
    let guildData: rawGuildSettings | null = await guildSettings.findOne({
        guild_id: guildID,
    });
    if (!guildData) return;
    let Settings = guildData.moderationSettings;
    if (data.enable == undefined) {
        data.enable = Settings.enable;
    }
    if (data.modLogChannel == undefined) {
        data.modLogChannel = Settings.modLogChannel;
    }
    if (data.modBlackList == undefined) {
        data.modBlackList = Settings.modBlackList;
    }
    if (data.urlBlock == undefined) {
        data.urlBlock = Settings.urlBlock;
    }
    if (data.urlWhiteList == undefined) {
        data.urlWhiteList = Settings.urlWhiteList;
    }

    await guildSettings.findOneAndUpdate(
        { guild_id: guildID },
        { moderationSettings: data }
    );
}
export async function UpdateExp(
    guildID: string,
    data: {
        enable?: boolean;
        increment?: number;
        timeDifference?: number;
        blacklistChannel?: Array<string>;
        expLogChannel?: string | null;
    }
) {
    let guildData: rawGuildSettings | null = await guildSettings.findOne({
        guild_id: guildID,
    });
    if (!guildData) return;
    let Settings = guildData.expSettings;
    if (data.enable == undefined) {
        data.enable = Settings.enable;
    }
    if (data.increment == undefined) {
        data.increment = Settings.increment;
    }
    if (data.timeDifference == undefined) {
        data.timeDifference = Settings.timeDifference;
    }
    if (data.blacklistChannel == undefined) {
        data.blacklistChannel = Settings.blacklistChannel;
    }
    if (data.expLogChannel == undefined) {
        data.expLogChannel = Settings.expLogChannel;
    }

    await guildSettings.findOneAndUpdate(
        { guild_id: guildID },
        { expSettings: data }
    );
}
