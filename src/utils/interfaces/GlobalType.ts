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
    enable:boolean,
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
    enable:boolean,
    messageCount: number;
    timeDifference: number;
    antispamChannel: Array<string>;
    warnUser: boolean;
    muteUser: boolean;
    deleteMessage: boolean;
}

/**
 * # *Moderation Settings!*
 * @param modLogChannel Channel to log the moderation commands used by menhera.
 */
export interface moderationSystemSettings {
    enable:boolean,
    modLogChannel?: string;
    modBlackList:Array<string>,
    urlBlock:boolean,
    urlWhiteList:Array<string>
}

/**
 * # Welcome System
 * @param welcomeDM Get a welcome message in dm? no? ok.
 * @param welcomeChannelMessage Message to send in the welcome channel. *I think...*
 * @param welcomeChannel Channel to welcome new users ***yay!***.
 * @param welcomeMessage *Uh* maybe this is the message that will be sent in dms?
 * @param welcomeRoles Array of roles to give new users.
 */
export interface welcomeSystemSettings {
    enable:Boolean,
    welcomeDM: Boolean,
    welcomeChannel: Boolean,
    welcomeChannelID: String,
    channelMessage: String,
    dmMessage: String,
    welcomeRoles: Array<string>
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
export interface rawGuildSettings {
    guild_id:string,
    expSettings:{
        enable:boolean,
        increment:number,
        timeDifference: number,
        blacklistChannel: Array<string>,
        expLogChannel: string
    },
    antiSpamSettings:{
        enable:boolean,
        messageCount: number,
        timeDifference: number,
        antispamChannel: Array<string>,
        warnUser: boolean,
        muteUser: boolean,
        deleteMessage: boolean,
    },
    moderationSettings:{
        enable:boolean,
        modLogChannel: string,
        modBlackList:Array<string>,
        urlBlock:boolean,
        urlWhiteList:Array<string>
    },
    welcomeSettings:{
        enable:Boolean,
        welcomeDM: Boolean,
        welcomeChannel: Boolean,
        welcomeChannelID: String,
        channelMessage: String,
        dmMessage: String,
        welcomeRoles: Array<string>
    }
}