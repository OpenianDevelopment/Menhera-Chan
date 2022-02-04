import BaseCommand from "../../structures/BaseCommand";
import DiscordClient from "../../client/client";
import {CheckPermsBoth} from "../../utils/functions/mod"
import {
    CommandInteraction,
} from "discord.js";

export default class PingCommand extends BaseCommand {
    constructor() {
        super("mod kick", "Kicks a user");
    }
    async run(client: DiscordClient, interaction: CommandInteraction) {
        if(!await CheckPermsBoth(interaction,"KICK_MEMBERS")){return}
        let data = interaction.options.getUser("user",true)
        let reason = interaction.options.getString("reason",false)
        let day = interaction.options.getInteger("days",false)
        if(reason == null){reason = "No reason given"}
        if(data.id == client.user?.id){
            interaction.followUp({
                content:"I can't ban myself"
            })
            return
        }
        let member = await interaction.guild?.members.fetch(data.id)
        if(member == null){
            interaction.followUp({
                content:"Cannot find user"
            })
            return
        }
        if(!member.bannable){
            interaction.followUp({
                content:"Cannot kick user"
            })
            return
        }
        if(day != null){
            await member.ban({reason:reason,days:day})
            interaction.followUp({
                content:`User ${member} was Banned for ${day} days}`
            })
            return
        }
        await member.ban({reason:reason})
        interaction.followUp({
            content:`User ${member} was Banned}`
        })
    }
}