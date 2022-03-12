import { CommandInteraction } from "discord.js";
import DiscordClient from "../../../client/client";
import { UpdateWelcome, UpdateModeration, UpdateAntispam, UpdateExp } from "../../../database/functions/GuildSettingsFunctions";
import BaseCommand from "../../../structures/BaseCommand";
import { CheckPermsBoth } from "../../../utils/functions/mod";
import { updateCacheGuildSettings } from "../../../utils/initialFunctions";


export default class enableDisableCommand extends BaseCommand {
    constructor() {
        super("settings welcomemessage enable-disable", "enables or disables a command");
    }
    async run(client: DiscordClient, interaction: CommandInteraction) {
        if(!interaction.guildId){
            interaction.followUp({
                content:"This command can only be used in guilds"
            })
            return
        }
        if (!(await CheckPermsBoth(interaction, "ADMINISTRATOR"))) {
            return;
        }
        let option = interaction.options.getBoolean("enable-disable",true)
        let service = interaction.options.getString("service",true)
        switch(service){
            case "dmmessage":
                await UpdateWelcome(interaction.guildId,{welcomeDM:option})
                break
            case "channelmessage":
                await UpdateWelcome(interaction.guildId,{welcomeChannel:option})
        }
        await updateCacheGuildSettings(client,interaction.guildId)
        let ed:string
        if(option){
            ed = "Enabled"
        }else{
            ed = "Disabled"
        }
        interaction.followUp({
            content:`${service} has been ${ed}`
        })
    }
}