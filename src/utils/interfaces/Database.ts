//Waifu
export interface WaifuDB {
    id: number;
    name: string;
    image: string;
    gender: string;
    anime: string;
    cost: string;
    wish: number;
}
//EconUser
export interface EconomyUserDB {
    user: string;
    balance: number;
    characters: [characterSchemaDB];
}
export interface characterSchemaDB {
    characterId: string;
}

//warnings schema
export interface WarnsData {
    id: string;
    userId: string;
    mod: string;
    reason: string;
    date: string;
}
export interface guildWarnData {
    guildId: string;
    warnings: WarnsData[];
}

//custom commands
export interface Tags {
    name: string;
    content?: string;
    embed?: string;
    reply?: boolean;
}
export interface guildTags {
    guildId: string;
    tags: Tags[];
}

// user schema

export interface userData {
    id: string;
    tag: string;
    avatarHash: string;
    guilds: string[];
}

export interface devMiscInt {
    id: "0";
    economy: { earning: number; cooldown: number };
    blacklists: {
        user: userData;
        blacklistedAt: { unix: Number; string: String };
        reason: String;
    }[];
}
