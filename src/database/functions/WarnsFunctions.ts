import { CreateWarnId } from "../../utils/functions/warns";
import { guildWarnData, WarnsData } from "../../utils/interfaces/Database";
import { warns } from "../schemas/index";

export async function initGuildWarns(guildId: string): Promise<void> {
    const newData = new warns({
        guildId: guildId,
        users: [],
    });
    await newData.save().catch(console.error);
}
export function delGuildWarns(guildId: string) {
    warns.findOneAndRemove({ guildId }).catch(console.error);
}
export async function getGuildWarnings(guildId: string) {
    const data: guildWarnData = await warns.findOne({ guildId });
    return data;
}
export async function getUserWarnings(guildId: string, userId: string) {
    const data: WarnsData[] | undefined = (
        await getGuildWarnings(guildId)
    ).warnings.filter((arr) => arr.userId == userId);
    return data;
}
export async function getSpecificWarn(
    guildId: string,
    userId: string,
    warnId: string
) {
    const warnData = (await getUserWarnings(guildId, userId))?.find(
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
export function removeWarn(guildId: string, warnId: string) {
    warns
        .updateOne(
            { guild: guildId },
            { $pull: { warnings: { id: warnId } } },
            { safe: true, multi: true }
        )
        .catch((err) => console.error(err));
}
