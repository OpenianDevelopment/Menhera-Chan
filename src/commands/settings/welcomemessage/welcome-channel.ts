import {
    CommandInteraction,
    GuildMember,
    Message,
    MessageEmbed,
} from "discord.js";
import DiscordClient from "../../../client/client";
import { UpdateWelcome } from "../../../database/functions/GuildSettingsFunctions";
import BaseCommand from "../../../structures/BaseCommand";
import { CheckPermsBoth } from "../../../utils/functions/mod";
import { updateCacheGuildSettings } from "../../../utils/initialFunctions";

export default class welcomeChannelCommand extends BaseCommand {
    constructor() {
        super("settings welcomemessage welcome-channel", "welcome channel");
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
        let channel = interaction.options.getChannel("channel",true)
        channel.id
        await UpdateWelcome(interaction.guildId,{welcomeChannelID:channel.id})
        await updateCacheGuildSettings(client,interaction.guildId)
        interaction.followUp({
            content:`welcome channe is now ${channel}`
        })
    }
}