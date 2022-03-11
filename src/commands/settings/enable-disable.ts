import BaseCommand from "../../structures/BaseCommand";
import DiscordClient from "../../client/client";
import {
    CommandInteraction,
    GuildMember,
    Message,
    MessageEmbed,
} from "discord.js";
import { UpdateAntispam, UpdateExp, UpdateModeration, UpdateWelcome } from "../../database/functions/GuildSettingsFunctions";
import { CheckPermsBoth } from "../../utils/functions/mod";
import { updateCacheGuildSettings } from "../../utils/initialFunctions";

export default class enableDisableCommand extends BaseCommand {
    constructor() {
        super("settings enable-disable", "enables or disables a command");
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
            case "welcomemessage":
                await UpdateWelcome(interaction.guildId,{enable:option})
                break
            case "urlblock":
                await UpdateModeration(interaction.guildId,{urlBlock:option})
                break
            case "modlog":
                await UpdateModeration(interaction.guildId,{enable:option})
                break
            case "antispam":
                await UpdateAntispam(interaction.guildId,{enable:option})
                break
            case "experience":
                await UpdateExp(interaction.guildId,{enable:option})
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