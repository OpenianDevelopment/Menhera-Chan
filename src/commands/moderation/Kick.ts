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
        if(reason == null){reason = "No reason given"}
        if(data.id == client.user?.id){
            interaction.followUp({
                content:"I can't kick myself",
                ephemeral: true
            })
            return
        }
        let member = await interaction.guild?.members.fetch(data.id)
        if(member == null){
            interaction.followUp({
                content:"Cannot find user",
                ephemeral: true
            })
            return
        }
        if(!member.kickable){
            interaction.followUp({
                content:"Cannot kick user",
                ephemeral: true
            })
            return
        }
        await member.kick(reason)
        interaction.followUp({
            content:`User ${member.user.username} was Kicked}`,
            ephemeral: true
        })
    }
}