import { waifu } from "../schemas/waifu";
import { economyUser } from "../schemas/EconomyUser";
import { EconomyUserDB, WaifuDB } from "../../utils/interfaces/Database";

export async function initEcoUser(user: string) {
    const profile = await economyUser.findOne({ user: user }).exec();
    if (!profile) {
        economyUser.create({
            user: user,
            balance: 0,
            characters: [],
        });
    }
}

export async function getUser(id: string) {
    return await economyUser.findOne({ user: id }).exec();
}

export async function getUserWaifus(id: string) {
    const data: EconomyUserDB = await economyUser.findOne({ user: id }).exec();
    return data.characters;
}

export async function getBalance(id: string) {
    const data: EconomyUserDB = await economyUser.findOne({ user: id }).exec();
    return data.balance;
}

export async function addBalance(user: string, balance: number) {
    const profile: EconomyUserDB | null = await economyUser.findOne({
        user: user,
    });
    if (!profile) {
        return initEcoUser(user);
    }
    const newbal = balance + profile.balance;
    await economyUser.findOneAndUpdate({ user: user }, { balance: newbal });
}
export async function removeBalance(user: string, balance: number) {
    const profile = await economyUser.findOne({ user: user });
    const newbal = profile.balance - balance;
    await economyUser.findOneAndUpdate({ user: user }, { balance: newbal });
}
export async function buyWaifu(user: string, id: string) {
    const data = await economyUser.findOne({ user: user }).exec();
    data.characters.push({ characterId: id });
    await economyUser.findOneAndUpdate(
        { user: user },
        { characters: data.characters }
    );
}
export async function sellWaifu(user: string, id: string) {
    const data = await economyUser.findOne({ user: user }).exec();
    const index = data.characters.indexOf(id);
    data.characters.splice(index, 1);
    await economyUser.findOneAndUpdate(
        { user: user },
        { characters: data.characters }
    );
}

export async function updateBalance(user: string, balance: number) {
    await economyUser.findOneAndUpdate({ user: user }, { balance: balance });
}

export async function getWaifu(name: string) {
    const data: Array<WaifuDB> = await waifu.find({
        name: { $regex: name, $options: "i" },
    });
    return data;
}

export async function getWaifuByID(ID: string) {
    const data: WaifuDB | null = await waifu.findOne({ id: ID });
    return data;
}
export async function getWaifuByIDArray(array: Array<string>) {
    const data: Array<WaifuDB> = await waifu
        .find({ id: { $in: array } })
        .exec();
    return data;
}

export async function updateWaifu(
    ID: number,
    N: string,
    I: string,
    G: string,
    A: string,
    C: string
) {
    const data: WaifuDB | null = await waifu.findOne({ id: ID });
    if (data == null) return false;
    if (N == null) {
        N = data.name;
    }
    if (I == null) {
        I = data.image;
    }
    if (G == null) {
        G = data.gender;
    }
    if (A == null) {
        A = data.anime;
    }
    if (C == null) {
        C = data.cost;
    }
    try {
        await waifu
            .findOneAndUpdate(
                { id: ID },
                { name: N, image: I, gender: G, anime: A, cost: C }
            )
            .catch(console.error);
    } catch {
        return false;
    } finally {
        return true;
    }
}
