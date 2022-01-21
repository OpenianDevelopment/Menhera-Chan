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
        var waifu = await getUserWaifus(user)
        if(waifu.find((x) => x.characterId == ID.toString())){
            interaction.followUp({content:`You already have Waifu ID: **${ID}**`})
            return
        }
        var waifuData = await getWaifuByID(ID.toString())
        if(waifuData == null){
            interaction.followUp({
                content:"Invalid ID"
            })
            return
        }
        removeBalance(user,parseInt(waifuData.cost))
        buyWaifu(user,waifuData.id.toString())
        interaction.followUp({
            content:`**${waifuData.name}** was Bought for **${waifuData.cost}**`
        })
    }
}