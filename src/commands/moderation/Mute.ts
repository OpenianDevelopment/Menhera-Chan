import BaseCommand from "../../structures/BaseCommand";
import DiscordClient from "../../client/client";
import {CheckPermsBoth} from "../../utils/functions/mod"
const ms = require('ms')
import {
    CommandInteraction,
} from "discord.js";

export default class PingCommand extends BaseCommand {
    constructor() {
        super("mod mute", "Mutes a user");
    }
    async run(client: DiscordClient, interaction: CommandInteraction) {
        if(!await CheckPermsBoth(interaction,"MODERATE_MEMBERS")){return}
        let data = interaction.options.getUser("user",true)
        var time
        try{
         time = ms(interaction.options.getString("time",true))
        }catch{
            interaction.followUp({
                content:"Invalid Time \nExample: 5d"
            })
            return
        }
        if(time<1){
            interaction.followUp({
                content:"Invalid Time \nTime cannot be negative"
            })
            return
        }
        let reason = interaction.options.getString("reason",false)
        if(reason == null){reason = "No reason given"}
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
            member.timeout(time,reason)
        }catch{
            interaction.followUp({
                content:`Failed to mute ${member}`
            })
        }
        interaction.followUp({
            content:`${member} was muted for ${ms(time,{long:true})}`
        })
    }
}