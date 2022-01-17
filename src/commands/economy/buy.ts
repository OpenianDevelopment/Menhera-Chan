import BaseCommand from "../../structures/BaseCommand";
import DiscordClient from "../../client/client";
import { buyWaifu, getUserWaifus, getWaifuByID, removeBalance, updateBalance } from "../../database/functions/EconFunctions";
import {
    CommandInteraction,
} from "discord.js";

export default class EconBalanceCommand extends BaseCommand {
    constructor() {
        super("econ buy", "To buy a charcters");
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
        var waifu:Array<string> = await getUserWaifus(user)
        if(waifu.find((x:any) => x.characterId == ID.toString())){
            interaction.followUp({content:`You already have Waifu ID: **${ID}**`})
            return
        }
        var waifuData:any = await getWaifuByID(ID.toString())
        removeBalance(user,waifuData.cost)
        buyWaifu(user,waifuData.id)
        interaction.followUp({
            content:`**${waifuData.name}** was Bought for **${waifuData.cost}**`
        })
    }
}