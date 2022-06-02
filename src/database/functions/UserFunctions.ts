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
    const guildData = await guildSettings.findOne({ guild_id: guildId });
    if (d) {
        const inc = d.guilds.includes(guildData._id);
        if (!inc) {
            d.guilds.push(guildData._id);
        }
        if (d["tag"] == tag && d["avatarHash"] == avatarHash && inc) {
            return true;
        } else {
            await user.findOneAndUpdate(
                { id },
                {
                    $set: {
                        tag: tag,
                        avatarHash: avatarHash,
                        guilds: d.guilds,
                    },
                }
            );
            return true;
        }
    } else {
        return await initUserData(id, tag, avatarHash, guildId);
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
