export interface GuildFeatureSettings {
    expSystem: boolean;
    antispamSystem: boolean;
    inviteSystem: boolean;
    welcomeSystem: boolean;
}

export interface ExpSystemSettings {
    increment: number;
    timeDifference: number;
    blacklistChannel: Array<string>;
    expLogChannel?: string;
}
export interface AntispamSystemSettings {
    messageCount: number;
    timeDifference: number;
    antispamChannel: Array<string>;
    warnUser: boolean;
    muteUser: boolean;
    deleteMessage: boolean;
}

export interface moderationSystemSettings {
    modLogChannel?: string;
    muteRole?: string;
}

export interface welcomeSystemSettings {
    welcomeDM: boolean;
    welcomeChannelMessage: boolean;
    welcomeChannel: string;
    welcomeMessage: string;
    welcomeRoles: Array<string>;
}

export interface GuildSettings {
    featureSettings: GuildFeatureSettings;
    expSettings?: ExpSystemSettings;
    antispamSettings?: AntispamSystemSettings;
    moderationSettings?: moderationSystemSettings;
    welcomeSettings?: welcomeSystemSettings;
}
