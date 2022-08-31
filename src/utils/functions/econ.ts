import { Interaction } from "discord.js";
import DiscordClient from "../../client/client";
import { viewEconomyData } from "../../database/functions/DevMisc";
import { addBalance } from "../../database/functions/EconFunctions";
const ecoMap = new Map();

export async function econ(data: Interaction, client: DiscordClient) {
    const cooldown = (await viewEconomyData()).cooldown;
    if (!data.guildId) return;
    if (!client.guildSettings.get(data.guildId)?.misc.econ) return;
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
