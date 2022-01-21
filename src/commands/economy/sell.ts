import { CommandInteraction, CacheType } from "discord.js";
import DiscordClient from "../../client/client";
import { addBalance, getUserWaifus, getWaifuByID, sellWaifu } from "../../database/functions/EconFunctions";
import BaseCommand from "../../structures/BaseCommand";

export default class EconSellCommand extends BaseCommand {
    constructor() {
        super("econ sell", "Sell Waifu");
    }
    async run(client: DiscordClient, interaction: CommandInteraction) {
        let ID = interaction.options.getInteger("id",true)
        if(ID<0){
            interaction.followUp({
                content:"Invalid ID"
            })
            return
        }
        var user = interaction.member?.user.id!
        var waifu = await getUserWaifus(user)
        if(!waifu.find((x:any) => x.characterId == ID.toString())){
            interaction.followUp({content:`You don't have Waifu ID: **${ID}**`})
            return
        } 
        var waifuData:any = await getWaifuByID(ID.toString())
        addBalance(user,parseInt(waifuData.cost))
        sellWaifu(user,ID.toString())
        interaction.followUp({
            content:`**${waifuData.name}** was Sold for **${waifuData.cost}**`
        })
    }

}
