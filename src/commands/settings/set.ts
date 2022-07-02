import CommandInt from "../../structures/BaseCommand";
import DiscordClient from "../../client/client";
import { CommandInteraction } from "discord.js";
import {
    UpdateAntispam,
    UpdateExp,
    UpdateModeration,
    UpdateStarboard,
    UpdateWelcome,
} from "../../database/functions/GuildSettingsFunctions";
import { CheckPerms } from "../../utils/functions/mod";
import { updateCacheGuildSettings } from "../../utils/initialFunctions";

const SettingsSet: CommandInt = {
    name: "settings set",
    description: "toggles a feature",
    async run(
        client: DiscordClient,
        interaction: CommandInteraction<"cached">
    ) {
        if (
            !(await CheckPerms(
                interaction,
                interaction.user.id,
                "ADMINISTRATOR"
            ))
        ) {
            return;
        }
        let service = interaction.options.getString("service", true);
        let option = interaction.options.getBoolean("toggle", true);
        switch (service) {
            case "welcome":
                await UpdateWelcome(interaction.guildId, { enable: option });
                break;
            case "url-block":
                await UpdateModeration(interaction.guildId, {
                    enable: option,
                    urlBlock: option,
                });
                break;
            case "mod-log":
                await UpdateModeration(interaction.guildId, { enable: option });
                break;
            case "anti-spam":
                await UpdateAntispam(interaction.guildId, { enable: option });
                break;
            case "experience":
                await UpdateExp(interaction.guildId, { enable: option });
            case "starboard":
                await UpdateStarboard(interaction.guildId, { enable: option });
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
        if (service == "starboard") {
            interaction.followUp({
                content: `*Note: to put the message on the starboard, the message needs at least 5 ⭐ reactions\nAuthor's reaction is not counted*`,
            });
        }
    },
};

export default SettingsSet;
