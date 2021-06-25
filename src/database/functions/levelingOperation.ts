import {guildXP} from "../../utils/interfaces/levelingInterfaces";
import {LevelXP} from "../schema";

export async function getLevel(guild?: string) {
    const guildXP: guildXP = await LevelXP.findOne({guild});
    return guildXP;
}

export function updateUserXP(
    user: string,
    xp: number,
    level: number,
    guild?: string
) {
    LevelXP.updateOne(
        {guild, "users.user": user},
        {
            $set: {
                "users.$.xp": xp,
                "users.$.level": level,
            },
        }
    ).catch((err: Error) => console.log(err));
}

export function initUserXP(user: string, guild?: string) {
    LevelXP.updateOne(
        {guild},
        {
            $push: {
                users: {
                    user: user,
                    xp: 0,
                    level: 0,
                    background: 'https://cdn.discordapp.com/attachments/791301593391562752/856879146175954954/rankcard2.png',
                    opacity: 0.5,
                    trackColor: "#21cc87",
                    textColor: "#554b58"
                },
            },
        }
    ).catch((err:Error)=>{
        throw  err;
    })
}
