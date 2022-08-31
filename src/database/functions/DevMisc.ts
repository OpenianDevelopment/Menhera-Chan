import { devMiscInt, userData } from "../../utils/interfaces/Database";
import { user } from "../schemas";
import { devMisc } from "../schemas/DeveloperMisc";

export async function getDevData() {
    const data = (await devMisc.findOne({ id: "0" })) as devMiscInt;
    if (!data) {
        const newData = await devMisc.create({
            id: "0",
            economy: { earning: 1, cooldown: 1500 },
            blacklists: [],
        });
        return newData as devMiscInt;
    }
    return data;
}

export async function viewEconomyData() {
    return (await getDevData()).economy;
}

export async function viewBlacklists() {
    return (await getDevData()).blacklists;
}

export async function addBlacklist(userId: string, reason: string) {
    const userdata = (await user.findOne({ id: userId })) as userData;
    return await devMisc.findOneAndUpdate(
        { id: "0" },
        {
            $push: {
                blacklists: {
                    user: userdata,
                    blacklistedAt: {
                        unix: Math.floor(Date.now() / 1000),
                        string: new Date().toUTCString(),
                    },
                    reason: reason,
                },
            },
        }
    );
}

export async function removeBlacklist(userid: string) {
    return await devMisc.findOneAndUpdate(
        { id: "0" },
        {
            $pull: {
                blacklists: { user: { id: userid } },
            },
        }
    );
}
