import { userData } from "../../utils/interfaces/Database";
import { guildSettings, user } from "../schemas/index";

export async function initUserData(
    id: string,
    tag: string,
    avatarHash: string,
    guildId: string
) {
    try {
        const data: userData | null = await user.findOne({ id });
        const guildData = await guildSettings.findOne({
            guild_id: guildId,
        });
        if (!data) {
            const d = new user({
                id: id,
                tag: tag,
                avatarHash: avatarHash,
                guilds: [guildData._id],
            });
            await d.save();
            return true;
        } else {
            return true;
        }
    } catch (err) {
        console.error(err);
        return false;
    }
}

export async function updateUserData(
    id: string,
    tag: string,
    avatarHash: string,
    guildId: string
) {
    const d: userData | null = await user.findOne({ id });
    const guildData = await guildSettings.findOne({ id: guildId });
    let updated = {
        id: id,
        tag: tag,
        avatarHash: avatarHash,
        guilds: [guildData._id],
    };
    if (d) {
        if (d.guilds.find((d) => d == guildData._id)) {
            updated["guilds"] = d.guilds;
        } else {
            updated["guilds"] = [...d.guilds, guildData._id];
        }
        if (d == updated) {
            return true;
        } else {
            await user.findOneAndUpdate({ id }, { updated });
            return true;
        }
    } else {
        return await initUserData(
            updated["id"],
            updated["tag"],
            updated["avatarHash"],
            guildId
        );
    }
}

export async function delUserData(id: string) {
    try {
        await user.findOneAndDelete({ id }).exec();
        return true;
    } catch (err) {
        console.error(err);
        return false;
    }
}
