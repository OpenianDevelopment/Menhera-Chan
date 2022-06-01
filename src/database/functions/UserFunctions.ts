import { userData } from "../../utils/interfaces/Database";
import { user } from "../schemas/index";

export async function initUserData(
    id: string,
    tag: string,
    avatarHash: string
) {
    try {
        const data: userData | null = await user.findOne({ id });
        if (!data) {
            const d = new user({
                id: id,
                tag: tag,
                avatarHash: avatarHash,
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
    avatarHash: string
) {
    const d: userData | null = await user.findOne({ id });
    let updated = { id: id, tag: tag, avatarHash: avatarHash };
    if (d) {
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
            updated["avatarHash"]
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
