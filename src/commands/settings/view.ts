import BaseCommand from "../../structures/BaseCommand";
import DiscordClient from "../../client/client";
import {CommandInteraction} from "discord.js";
import { getGuildSettings } from "../../database/functions/GuildSettingsFunctions";
import { CheckPermsBoth } from "../../utils/functions/mod";
import { CustomEmbed } from "../../utils/functions/Custom";

export default class viewCommand extends BaseCommand {
    constructor() {
        super("settings view", "to view settings");
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
        //make this in a more presentable format i don't care rn -julio
        const settings = await getGuildSettings(interaction.guildId)
        const embed = new CustomEmbed(interaction, false)
            .setTitle(`${interaction.guild?.name} Settings`)
            .addFields(
                {name:"exp Settings",value:`${settings.expSettings}`},
                {name:"antispam Settings",value:`${settings.antiSpamSettings}`},
                {name:"moderation Settings",value:`${settings.moderationSettings}`},
                {name:"welcome Settings",value:`${settings.welcomeSettings}`}
            )
        interaction.followUp({embeds:[embed]})
    }
}