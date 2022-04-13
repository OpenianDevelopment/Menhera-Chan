import { CommandInteraction } from "discord.js";
import DiscordClient from "../../../client/client";
import { UpdateWelcome } from "../../../database/functions/GuildSettingsFunctions";
import BaseCommand from "../../../structures/BaseCommand";
import { CheckPerms } from "../../../utils/functions/mod";
import { updateCacheGuildSettings } from "../../../utils/initialFunctions";

export default class SetCommand extends BaseCommand {
    constructor() {
        super("settings welcome set", "toggles a welcome feature");
    }
    async run(
        client: DiscordClient,
        interaction: CommandInteraction<"cached">
    ) {
        if (!(await CheckPerms(interaction, interaction.user.id, "ADMINISTRATOR"))) {
            return;
        }
        let option = interaction.options.getBoolean("toggle", true);
        let service = interaction.options.getString("service", true);
        switch (service) {
            case "dm-message":
                await UpdateWelcome(interaction.guildId, { welcomeDM: option });
                break;
            case "channel-message":
                await UpdateWelcome(interaction.guildId, {
                    welcomeChannel: option,
                });
        }
        await updateCacheGuildSettings(client, interaction.guildId);
        let ed: string;
        if (option) {
            ed = "Enabled";
        } else {
            ed = "Disabled";
        }
        interaction.followUp({
            content: `${service} has been ${ed}`,
        });
    }
}
