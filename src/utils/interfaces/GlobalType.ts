/**
 * # Guild's Feature Settings
 * (idk wtf is with that title)
 * @param expModule {boolean}
 * @param antispamModule {boolean}
 * @param inviteModule {boolean}
 * @param welcomeModule {boolean}
 * @param newsModule {boolean}
 */

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
    expLogChannel?: string;
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
 */
export interface moderationSystemSettings {
    enable: boolean;
    modLogChannel?: string;
    modBlackList: Array<string>;
    urlBlock: boolean;
    urlWhiteList: Array<string>;
}

/**
 * # Welcome System
 */
export interface welcomeSystemSettings {
    enable: boolean;
    welcomeDM: boolean;
    welcomeChannel: boolean;
    welcomeChannelID: string;
    channelMessage: string;
    dmMessage: string;
    welcomeRoles: Array<string>;
    CustomWelcomeBackground: string;
}

/**
 * # Guild Settings
 * @param modulesSettings The ***Guild's Feature Settings*** that i didn't like.
 * @param expSettings The super cool *one of the first features of menhera* xp (but that is it's settings).
 *
 * Uh i'm lazy to continue, You already know what are those from above, if you don't know then `Ctrl + click` on **GuildSettings**
 * @param antispamSettings {AntispamSystemSettings}
 * @param moderationSettings {moderationSystemSettings}
 * @param welcomeSettings {welcomeSystemSettings}
 */
export interface GuildSettings {
    expSettings: ExpSystemSettings;
    antispamSettings: AntispamSystemSettings;
    moderationSettings: moderationSystemSettings;
    welcomeSettings: welcomeSystemSettings;
}

//raw setting
//having this giving errors when i chage something is tiresome
export interface rawGuildSettings {
    guild_id: string;
    expSettings: {
        enable: boolean;
        increment: number;
        timeDifference: number;
        blacklistChannel: Array<string>;
        expLogChannel: string;
    };
    antiSpamSettings: {
        enable: boolean;
        messageCount: number;
        timeDifference: number;
        antispamChannel: Array<string>;
        warnUser: boolean;
        muteUser: boolean;
        deleteMessage: boolean;
    };
    moderationSettings: {
        enable: boolean;
        modLogChannel: string;
        modBlackList: Array<string>;
        urlBlock: boolean;
        urlWhiteList: Array<string>;
    };
    welcomeSettings: {
        enable: boolean;
        welcomeDM: boolean;
        welcomeChannel: boolean;
        welcomeChannelID: string;
        channelMessage: string;
        dmMessage: string;
        welcomeRoles: Array<string>;
        CustomWelcomeBackground: string;
    };
}
