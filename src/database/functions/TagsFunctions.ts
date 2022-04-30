import { Tags, guildTags } from "../../utils/interfaces/Database";
import { tags } from "../schemas";

export async function initGuildTags(guildId: string) {
    const newData = new tags({
        guildId: guildId,
        tags: [],
    });
    try {
        await newData.save();
        return newData;
    } catch {
        return false;
    }
}
export async function getGuildTags(guildId: string): Promise<guildTags> {
    const data: guildTags | null = await tags.findOne({
        guildId,
    });
    if (!data) {
        return await initGuildTags(guildId);
    }
    return data;
}
export function delGuildCommand(guildId: string, name: string) {
    try {
        tags.updateOne(
            { guildId: guildId },
            { $pull: { tags: { name: name } } }
        );
        return true;
    } catch {
        return false;
    }
}
export async function addGuildTag(
    guildId: string,
    name: string,
    reply: boolean,
    content?: string,
    embed?: string
) {
    const guildData = await getGuildTags(guildId);
    if (guildData) {
        try {
            const data = await tags.findOne({ guildId: guildId });
            data.tags.push({
                name: name,
                reply: reply,
                content: content ? content : null,
                embed: embed ? embed : null,
            });
            data.save();
            return true;
        } catch {
            return false;
        }
    } else {
        return false;
    }
}
export async function editGuildTag(
    guildId: string,
    name: string,
    content?: string,
    embed?: string
) {
    const guildData = await getGuildTags(guildId);
    if (guildData) {
        const oldData = guildData.tags.find((t) => t.name === name);
        try {
            await tags.updateOne(
                { guildId: guildId, tags: { name: name } },
                {
                    tags: {
                        name: name,
                        content: content
                            ? content
                            : oldData
                            ? oldData.content
                            : null,
                        embed: embed ? embed : oldData ? oldData.embed : null,
                    },
                }
            );
            return true;
        } catch {
            return false;
        }
    } else {
        return false;
    }
}
