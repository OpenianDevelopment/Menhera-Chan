import BaseCommand from "../../structures/BaseCommand";
import DiscordClient from "../../client/client";
import {CheckPermsBoth} from "../../utils/functions/mod"
import {
    CommandInteraction,
} from "discord.js";

export default class PingCommand extends BaseCommand {
    constructor() {
        super("mod unmute", "Unmutes a user");
    }
    async run(client: DiscordClient, interaction: CommandInteraction) {
        if(!await CheckPermsBoth(interaction,"MODERATE_MEMBERS")){return}
        let data = interaction.options.getUser("user",true)
        if(data.id == client.user?.id){
            interaction.followUp({
                content:"I can't mute myself"
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
        if(!member.moderatable){
            interaction.followUp({
                content:"Cannot mute user"
            })
            return
        }
        try{
            member.timeout(0,"")
        }catch{
            interaction.followUp({
                content:`Failed to unmute member ${member}`
            })
        }
        interaction.followUp({
            content:`${member} was unmuted`
        })
    }
}