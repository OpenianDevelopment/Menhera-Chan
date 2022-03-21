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
//something else
