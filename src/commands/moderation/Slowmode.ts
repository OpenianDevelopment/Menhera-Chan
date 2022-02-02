import BaseCommand from "../../structures/BaseCommand";
import DiscordClient from "../../client/client";
import {CheckPerms,CheckPermsBoth} from "../../utils/functions/mod"
import {
    CommandInteraction,
    NewsChannel,
    TextChannel,
    ThreadChannel,
} from "discord.js";

export default class PingCommand extends BaseCommand {
    constructor() {
        super("mod slowmode", "To set the slowmode of the channel the command is written in");
    }
    async run(client: DiscordClient, interaction: CommandInteraction) {
        if(!await CheckPermsBoth(interaction,"MANAGE_CHANNELS")){return}
        let seconds = interaction.options.getInteger("seconds",true)
        if(seconds >100 ||seconds <0){
            interaction.followUp({
                content:"Invalid Time\nTime should be between 0 and 100",
                ephemeral:true
            })
            return
        }
        const channel = interaction.channel as TextChannel|NewsChannel|ThreadChannel;
        channel.edit({rateLimitPerUser: seconds})
        interaction.followUp({
            content:`The channel is now in slowmode with ${seconds} seconds`,
            ephemeral:true
        })
    }
}