import { CreateWarnId } from "../../utils/functions/warns";
import { guildWarnData, WarnsData } from "../../utils/interfaces/Database";
import { warns } from "../schemas/index";

export async function initGuildWarns(guildId: string): Promise<void> {
    const newData = new warns({
        guildId: guildId,
        warnings: [],
    });
    await newData.save().catch(console.error);
}
export function delGuildWarns(guildId: string) {
    warns.findOneAndRemove({ guildId }).catch(console.error);
}
export async function getGuildWarnings(guildId: string) {
    const data: guildWarnData | null = await warns.findOne({ guildId });
    return data;
}
export async function getUserWarnings(guildId: string, userId: string) {
    const data: WarnsData[] | undefined = (
        await getGuildWarnings(guildId)
    )?.warnings.filter((arr) => arr.userId == userId);
    return data;
}
export async function getSpecificWarn(guildId: string, warnId: string) {
    const warnData = (await getGuildWarnings(guildId))?.warnings.find(
        (wAr) => wAr.id == warnId
    );
    return warnData;
}
export async function addWarn(
    guildId: string,
    userId: string,
    authorId: string,
    reason: string
) {
    const guildData = await getGuildWarnings(guildId);
    if (!guildData) {
        initGuildWarns(guildId).then(
            async () => await addWarn(guildId, userId, authorId, reason)
        );
        return;
    }
    warns
        .updateOne(
            { guild: guildId },
            {
                $push: {
                    warnings: {
                        id: CreateWarnId(userId),
                        userId: userId,
                        mod: authorId,
                        reason: reason,
                        date: Date.now().toString(),
                    },
                },
            },
            { safe: true, multi: true }
        )
        .catch((err) => console.error(err));
}
export async function removeWarn(guildId: string, warnId: string) {
    try {
        const warn = await getSpecificWarn(guildId, warnId);
        if (!warn) return false;
        warns.updateOne(
            { guild: guildId },
            { $pull: { warnings: { id: warnId } } },
            { safe: true, multi: true }
        );
        return true;
    } catch {
        return false;
    }
}
