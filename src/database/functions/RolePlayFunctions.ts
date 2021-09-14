import { rolePlay } from "../schemas";

export async function getRolePlayGifs(type: string) {
    const result = await rolePlay.findOne({ type });
    return result;
}

export async function addRolePlayGifs(type: string, img: string) {
    rolePlay
        .updateOne({ type }, { $push: { images: img } })
        .catch(console.error);
}
