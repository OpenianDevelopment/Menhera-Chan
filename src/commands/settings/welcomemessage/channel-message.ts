import {
    CommandInteraction,
    GuildMember,
    Message,
    MessageEmbed,
} from "discord.js";
import DiscordClient from "../../../client/client";
import { UpdateWelcome } from "../../../database/functions/GuildSettingsFunctions";
import BaseCommand from "../../../structures/BaseCommand";
import { clean } from "../../../utils/functions/Custom";
import { CheckPermsBoth } from "../../../utils/functions/mod";
import { updateCacheGuildSettings } from "../../../utils/initialFunctions";

export default class welcomeChannelCommand extends BaseCommand {
    constructor() {
        super("settings welcomemessage channel-message", "channel message");
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
        let message = interaction.options.getString("message",true)
        await UpdateWelcome(interaction.guildId,{channelMessage:message})
        let test = message.replace(
            /{member}/g,
            "<@!" + interaction.user.id + ">"
        ).replace(
            /{server}/g,
            "**" + clean(interaction.guild?.name) + "**"
        );
        await updateCacheGuildSettings(client,interaction.guildId)
        interaction.followUp({
            content:`Dm message updated \n**Demo:**\n \` ${test} \``
        })
    }
}