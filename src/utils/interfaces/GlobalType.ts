/**
 * # Exp Settings
 * @param increment *I guess it's the "how much xp to add"?*
 * @param timeDifference Something like cooldown.
 * @param blacklistChannel Channels where users can't get xp.
 * @param expLogChannel The "Congratulations on leveling up!" channel.
 */
export interface ExpSystemSettings {
    enable: boolean;
    increment: number;
    timeDifference: number;
    blacklistChannel: Array<string>;
    expLogChannel: string | null;
}

/**
 * # Antispam Settings
 * @param messageCount As you can guess it's the *message count!*
 * @param timeDifference Still is something like cooldown.
 * @param antispamChannel Channels where menhera con go brrr and ban all spammers.
 * @param warnUser Whether to warn the user or not.
 * @param muteUser Whether to mute the user or not.
 * @param deleteMessage Whether to delete the spam messages or not.
 */
export interface AntispamSystemSettings {
    enable: boolean;
    messageCount: number;
    timeDifference: number;
    antispamChannel: Array<string>;
    warnUser: boolean;
    muteUser: boolean;
    deleteMessage: boolean;
}

/**
 * # *Moderation Settings!*
 * @param enable enable/disable service
 * @param modLogChannel channel for modlog
 * @param modBlackList moderation blacklist channel
 * @param urlBlock enable/disable url block
 * @param urlWhiteList url whitelist
 */
export interface moderationSystemSettings {
    enable: boolean;
    modLogChannel: string | null;
    modBlackList: Array<string>;
    urlBlock: boolean;
    urlWhiteList: Array<string>;
}

/**
 * # Welcome System
 * @param enable enable/disable service
 * @param welcomeDM enable/disable dm
 * @param welcomeChannel enable/disable channel message
 * @param welcomeChannelID channel id
 * @param channelMessage welcome message for channel
 * @param dmMessage welcome message for dm
 * @param welcomeRoles roles to give on join
 * @param CustomWelcomeBackground background
 */
export interface welcomeSystemSettings {
    enable: boolean;
    welcomeDM: boolean;
    welcomeChannel: boolean;
    welcomeChannelID: string | null;
    channelMessage: string | null;
    dmMessage: string | null;
    welcomeRoles: Array<string>;
    CustomWelcomeBackground: string | null;
}

/**
 * # StarBoard
 * @param enable startboard is enabled or not
 * @param channel starboard channel id
 */
export interface starboardSettings {
    enable: boolean;
    channel: string | null;
}

/**
 * # misc
 * @param econ enable/disable econ
 */

export interface misc {
    econ: boolean;
}

/**
 * # Guild Settings
 * @param expSettings The super cool *one of the first features of menhera* xp (but that is it's settings).
 *
 * Uh i'm lazy to continue, You already know what are those from above, if you don't know then `Ctrl + click` on **GuildSettings**
 * @param antispamSettings {AntispamSystemSettings}
 * @param moderationSettings {moderationSystemSettings}
 * @param welcomeSettings {welcomeSystemSettings}
 * @param misc {misc}
 */
export interface GuildSettings {
    expSettings: ExpSystemSettings;
    antispamSettings: AntispamSystemSettings;
    moderationSettings: moderationSystemSettings;
    welcomeSettings: welcomeSystemSettings;
    starboardSettings: starboardSettings;
    misc: misc;
}
/**
 * # Raw guild Settings
 */
export interface rawGuildSettings {
    guild_id: string;
    expSettings: ExpSystemSettings;
    antispamSettings: AntispamSystemSettings;
    moderationSettings: moderationSystemSettings;
    welcomeSettings: welcomeSystemSettings;
    starboardSettings: starboardSettings;
    misc: misc;
}
