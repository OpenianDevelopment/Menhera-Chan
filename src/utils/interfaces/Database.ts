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
