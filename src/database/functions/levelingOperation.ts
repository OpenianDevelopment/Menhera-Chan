import { levelXp } from "../schemas";

export async function getLevel(guild?: string) {
    const guildXP = await levelXp.findOne({ guild });
    return guildXP as any;
}

export function updateUserXP(
    user: string,
    xp: number,
    level: number,
    guild?: string
) {
    levelXp
        .updateOne(
            { guild, "users.user": user },
            {
                $set: {
                    "users.$.xp": xp,
                    "users.$.level": level,
                },
            }
        )
        .catch((err: Error) => console.log(err));
}
export function updateUserBackground(
    user: string,
    guild: string,
    background: string
) {
    levelXp
        .updateOne(
            { guild, "users.user": user },
            {
                $set: {
                    "users.$.background": background,
                },
            }
        )
        .catch((err: Error) => console.log(err));
}
export function updateUserOpacity(
    user: string,
    guild: string,
    opacity: number
) {
    levelXp
        .updateOne(
            { guild, "users.user": user },
            {
                $set: {
                    "users.$.opacity": opacity,
                },
            }
        )
        .catch((err: Error) => console.log(err));
}
export function updateUserTrackColor(
    user: string,
    guild: string,
    trackColor: string
) {
    levelXp
        .updateOne(
            { guild, "users.user": user },
            {
                $set: {
                    "users.$.trackColor": trackColor,
                },
            }
        )
        .catch((err: Error) => console.log(err));
}
export function updateUserTextColor(
    user: string,
    guild: string,
    textColor: string
) {
    levelXp
        .updateOne(
            { guild, "users.user": user },
            {
                $set: {
                    "users.$.textColor": textColor,
                },
            }
        )
        .catch((err: Error) => console.log(err));
}
export function initUserXP(user: string, guild?: string) {
    levelXp
        .updateOne(
            { guild },
            {
                $push: {
                    users: {
                        user: user,
                        xp: 0,
                        level: 0,
                        background:
                            "https://cdn.discordapp.com/attachments/791301593391562752/856879146175954954/rankcard2.png",
                        opacity: 0.7,
                        trackColor: "#21cc87",
                        textColor: "#f5deb3",
                    },
                },
            }
        )
        .catch((err: Error) => {
            throw err;
        });
}