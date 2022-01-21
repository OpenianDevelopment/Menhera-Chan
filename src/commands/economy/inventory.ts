import BaseCommand from "../../structures/BaseCommand";
import DiscordClient from "../../client/client";
import { getUserWaifus, getWaifuByIDArray } from "../../database/functions/EconFunctions";

import {
    CommandInteraction,
    MessageEmbed,
} from "discord.js";
import { embed } from "../../utils/functions/embed";

export default class EconBalanceCommand extends BaseCommand {
    constructor() {
        super("econ inventory", "Shows Collection of Waifus");
    }
    async run(client: DiscordClient, interaction: CommandInteraction) {

        var user = interaction.member?.user.id!
        var data = await getUserWaifus(user)
        if(data.length < 1){
            interaction.followUp({
                content:"You don't have anything in your inventory."
            })
            return
        }
        var WaifuId:Array<string> = []
        data.forEach(async (x) =>{
           await WaifuId.push(x.characterId)
        })
        var waifu = await getWaifuByIDArray(WaifuId)
        var embeds:any = []
        waifu.forEach(async (x)=>{
            const embed = new MessageEmbed()
            .setTitle(`${interaction.member?.user.username}'s Collection`)
            .setDescription(`
            **Name: ${x.name}**\n
            ID: ${x.id}\n
            Anime: ${x.anime}\n
            Price: ${x.cost}
            `)
            .setImage(x.image)
            await embeds.push(embed)
        })
        embed(interaction,embeds,0)
    }
}