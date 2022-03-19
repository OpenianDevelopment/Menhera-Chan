import BaseCommand from "../../structures/BaseCommand";
import DiscordClient from "../../client/client";
import {
    getUserWaifus,
    getWaifuByIDArray,
} from "../../database/functions/EconFunctions";
import { CommandInteraction, MessageEmbed } from "discord.js";
import { embedMaker } from "../../utils/functions/embed";
import { CustomEmbed } from "../../utils/functions/Custom";

export default class EconInvCommand extends BaseCommand {
    constructor() {
        super("econ inventory", "Shows Collection of Waifus");
    }
    async run(client: DiscordClient, interaction: CommandInteraction<"cached">) {
        if(!client.guildSettings.get(interaction.guildId)?.misc.econ){
            interaction.followUp({content:"This command is disabled in this server"})
            return
        }
        const user = interaction.user.id!;
        const data = await getUserWaifus(user);
        if (data.length < 1) {
            interaction.followUp({
                content: "You don't have anything in your inventory.",
            });
            return;
        }
        const WaifuId: Array<string> = [];
        data.forEach(async (x) => {
            WaifuId.push(x.characterId);
        });
        const waifu = await getWaifuByIDArray(WaifuId);
        const embeds: MessageEmbed[] = [];
        waifu.forEach(async (x) => {
            const embed = new CustomEmbed(interaction, false)
                .setTitle(`${interaction.user.username}'s Collection`)
                .setDescription(
                    `**Name: ${x.name}**\nID: ${x.id}\nAnime: ${x.anime}\nPrice: ${x.cost}`
                )
                .setImage(x.image);
            await embeds.push(embed);
        });
        embedMaker(interaction, embeds, 0);
    }
}
