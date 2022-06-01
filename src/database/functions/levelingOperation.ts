import { User } from "discord.js";
import { guildXP, userXP } from "../../utils/interfaces/leveling";
import { levelXp, user as userSchema } from "../schemas";
import { initUserData } from "./UserFunctions";

export async function getLevel(guildID: string) {
    let guildData = await levelXp.findOne({ guild: guildID });
    if (!guildData) {
        await initXP(guildID);
        return (await levelXp.findOne({ guild: guildID })) as guildXP;
    }
    return guildData as guildXP;
}

export async function getUserLevel(
    guildID: string,
    user: User
): Promise<userXP> {
    const guild = await levelXp.findOne({ guild: guildID });
    const userData = await userSchema.findOne({ id: user.id });
    if (!userData) {
        await initUserData(
            user.id,
            user.tag,
            user.avatar
                ? user.avatar
                : (parseInt(user.discriminator) % 5).toString(),
            guildID
        );
        return await getUserLevel(guildID, user);
    }
    if (!guild) {
        const newGuild = new levelXp({
            guild: guildID,
            users: [
                {
                    user: userData._id,
                    id: user.id,
                    xp: 0,
                    level: 0,
                    background:
                        "https://cdn.discordapp.com/attachments/791301593391562752/856879146175954954/rankcard2.png",
                    opacity: 0.7,
                    trackColor: "#21cc87",
                    textColor: "#f5deb3",
                },
            ],
        });
        await newGuild.save().catch(console.error);
        return {
            user: userData._id,
            id: user.id,
            xp: 0,
            level: 0,
            background:
                "https://cdn.discordapp.com/attachments/791301593391562752/856879146175954954/rankcard2.png",
            opacity: 0.7,
            trackColor: "#21cc87",
            textColor: "#f5deb3",
        } as userXP;
    }
    const userdata = await guild.users.find((e: userXP) => e.id == user.id);
    if (!userdata) {
        await initUserXP(user, guildID);
        return {
            user: userData._id,
            id: user.id,
            xp: 0,
            level: 0,
            background:
                "https://cdn.discordapp.com/attachments/791301593391562752/856879146175954954/rankcard2.png",
            opacity: 0.7,
            trackColor: "#21cc87",
            textColor: "#f5deb3",
        } as userXP;
    }
    return userdata as userXP;
}

export function updateUserXP(
    userId: string,
    xp: number,
    level: number,
    guild?: string
) {
    levelXp
        .updateOne(
            { guild, "users.id": userId },
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
    userId: string,
    guild: string,
    background: string
) {
    levelXp
        .updateOne(
            { guild, "users.id": userId },
            {
                $set: {
                    "users.$.background": background,
                },
            }
        )
        .catch((err: Error) => console.log(err));
}
export function updateUserOpacity(
    userId: string,
    guild: string,
    opacity: number
) {
    levelXp
        .updateOne(
            { guild, "users.id": userId },
            {
                $set: {
                    "users.$.opacity": opacity,
                },
            }
        )
        .catch((err: Error) => console.log(err));
}
export function updateUserTrackColor(
    userId: string,
    guild: string,
    trackColor: string
) {
    levelXp
        .updateOne(
            { guild, "users.id": userId },
            {
                $set: {
                    "users.$.trackColor": trackColor,
                },
            }
        )
        .catch((err: Error) => console.log(err));
}
export function updateUserTextColor(
    userId: string,
    guild: string,
    textColor: string
) {
    levelXp
        .updateOne(
            { guild, "users.id": userId },
            {
                $set: {
                    "users.$.textColor": textColor,
                },
            }
        )
        .catch((err: Error) => console.log(err));
}
export async function initUserXP(user: User, guildID: string) {
    const userData = await userSchema.findOne({ id: user.id });
    if (
        await initUserData(
            user.id,
            user.tag,
            user.avatar
                ? user.avatar
                : (parseInt(user.discriminator) % 5).toString(),
                guildID
        )
    ) {
        await levelXp
            .updateOne(
                { guild: guildID },
                {
                    $push: {
                        users: {
                            user: userData._id,
                            id: user.id,
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
        return;
    } else {
        await initUserXP(user, guildID);
        return;
    }
}

export async function initXP(guild?: string) {
    const newGuild = new levelXp({
        guild: guild,
        users: [],
    });
    await newGuild.save().catch(console.error);
}
