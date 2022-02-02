import BaseCommand from "../../structures/BaseCommand";
import DiscordClient from "../../client/client";
import {
    CommandInteraction,
    NewsChannel,
    TextChannel,
    ThreadChannel,
} from "discord.js";

export default class PingCommand extends BaseCommand {
    constructor() {
        super("mod purge", "Remove chat messages");
    }
    async run(client: DiscordClient, interaction: CommandInteraction) {
        if(!await CheckPermsBoth()){return}
        let ammount = interaction.options.getInteger("ammount", true);
        if(ammount < 1 || ammount > 100){
            interaction.followUp({
                content:"Invaild Ammount\n Please Provide a number Between 1 to 100",
                ephemeral: true
            })
            return
        }
        if(interaction.channel?.type =="DM")
        {
            interaction.followUp({
                content:"Cannot Purge DM"
            })
            return
        }
        const channel = interaction.channel as TextChannel|NewsChannel|ThreadChannel;
        channel.bulkDelete(ammount)
    }
}