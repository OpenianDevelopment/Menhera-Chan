import { guildXP,userXP } from "../../utils/interfaces/leveling";
import { levelXp } from "../schemas";

export async function getLevel(guildID: string) {
    let guildData = await levelXp.findOne({ guild:guildID })
    if(!guildData){
        await initXP(guildID)
        return await levelXp.findOne({ guild:guildID }) as guildXP
    }
    return guildData as guildXP;
}

export async function getUserLevel(guildID:string,userID:string) {
    const guild = await levelXp.findOne({ guild:guildID })
    if(!guild){
        const newGuild = new levelXp({
            guild:guildID,
            users:[{
                user: userID,
                xp: 0,
                level: 0,
                background:"https://cdn.discordapp.com/attachments/791301593391562752/856879146175954954/rankcard2.png",
                opacity: 0.7,
                trackColor: "#21cc87",
                textColor: "#f5deb3"
            }]
        })
        await newGuild.save().catch(console.error);
        return {
            user: userID,
            xp: 0,
            level: 0,
            background:"https://cdn.discordapp.com/attachments/791301593391562752/856879146175954954/rankcard2.png",
            opacity: 0.7,
            trackColor: "#21cc87",
            textColor: "#f5deb3"
        } as userXP
    }
    const userdata = await guild.users.find((e:userXP) => e.user == userID)
    if(!userdata){
        await initUserXP(userID,guildID)
        return {
            user: userID,
            xp: 0,
            level: 0,
            background:"https://cdn.discordapp.com/attachments/791301593391562752/856879146175954954/rankcard2.png",
            opacity: 0.7,
            trackColor: "#21cc87",
            textColor: "#f5deb3"
        } as userXP
    }
    return userdata as userXP
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
export async function initUserXP(user: string, guildID?: string) {
    await levelXp.updateOne(
        { guild:guildID },
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

export async function initXP(guild?: string) {
    const newGuild = new levelXp({
        guild:guild,
        users:[]
    })
    await newGuild.save().catch(console.error);
}
