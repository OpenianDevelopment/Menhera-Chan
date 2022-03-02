//Waifu
interface WaifuDB {
    id: number;
    name: string;
    image: string;
    gender: string;
    anime: string;
    cost: string;
    wish: number;
}
//EconUser
interface EconomyUserDB {
    user: string;
    balance: number;
    characters: [characterSchemaDB];
}
interface characterSchemaDB {
    characterId: string;
}
//something else
