import { CommandInteraction } from "discord.js";
import DiscordClient from "../../../client/client";
import { UpdateWelcome } from "../../../database/functions/GuildSettingsFunctions";
import BaseCommand from "../../../structures/BaseCommand";
import { clean, CustomEmbed } from "../../../utils/functions/Custom";
import { CheckPermsBoth } from "../../../utils/functions/mod";
import { updateCacheGuildSettings } from "../../../utils/initialFunctions";

export default class dmMessageCommand extends BaseCommand {
    constructor() {
        super("settings welcome dm", "dm message");
    }
    async run(
        client: DiscordClient,
        interaction: CommandInteraction<"cached">
    ) {
        if (!(await CheckPermsBoth(interaction, "ADMINISTRATOR"))) {
            return;
        }
        let message = interaction.options.getString("message", true);
        await UpdateWelcome(interaction.guildId, { dmMessage: message });
        let test = message
            .replace(/{member}/g, `<@!${interaction.user.id}>`)
            .replace(/{server}/g, `**${clean(interaction.guild?.name)}**`)
            .replace(/\\new/gi, "\n");
        await updateCacheGuildSettings(client, interaction.guildId);
        const embed = new CustomEmbed(interaction)
            .setDescription("**Welcome Dm Settings Updated**")
            .addFields({ name: "Message Demo", value: `\` ${test} \`` });
        interaction.followUp({
            embeds: [embed],
        });
    }
}
