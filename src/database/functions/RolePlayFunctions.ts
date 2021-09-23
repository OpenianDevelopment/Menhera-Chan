import { rolePlay } from "../schemas";

export async function getRolePlayGifs(type: string) {
    const result = await rolePlay.findOne({ type });
    return result;
}

export async function addRolePlayGifs(
    type: string,
    img: string | Array<string>
) {
    if (Array.isArray(img)) {
        img.forEach((gif) => {
            rolePlay
                .updateOne({ type }, { $push: { images: gif } })
                .catch(console.error);
        });
        return true;
    } else if (typeof img == "string") {
        rolePlay
            .updateOne({ type }, { $push: { images: img } })
            .catch(console.error);
        return true;
    }
    return false;
}
