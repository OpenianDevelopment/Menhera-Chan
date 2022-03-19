import { Interaction } from "discord.js";
import DiscordClient from "../../client/client";
import { addBalance } from "../../database/functions/EconFunctions";
const ecoMap = new Map();
const cooldown = 15000;

export function econ(data: Interaction,client: DiscordClient) {
    if(!data.guildId)return
    if(!client.guildSettings.get(data.guildId)?.misc.econ)return
    const user = data.member?.user.id!;
    let balance = Math.floor(Math.random() * 9) + 1;
    if (balance > 1) {
        balance =
            Math.floor(balance / (Math.floor(Math.random() * 9) + 1)) * 10;
    } else {
        balance = balance * 10;
    }
    if (ecoMap.has(user)) {
        const userData = ecoMap.get(user);
        const difference = data.createdTimestamp - userData;
        if (difference >= cooldown) {
            addBalance(user, balance);
            ecoMap.set(user, data.createdTimestamp);
        }
    } else {
        ecoMap.set(user, data.createdTimestamp);
    }
}
