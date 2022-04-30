import BaseCommand from "../../structures/BaseCommand";
import DiscordClient from "../../client/client";
import { CommandInteraction } from "discord.js";
import { delGuildCommand } from "../../database/functions/TagsFunctions";
import { CheckPerms } from "../../utils/functions/mod";

export default class CCTDelCommand extends BaseCommand {
    constructor() {
        super("tag delete", "Deletes a tag");
    }
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
        const name = interaction.options.getString("name", true);
        if (delGuildCommand(interaction.guildId, name)) {
            interaction.followUp({
                content: `Command **${name}** was deleted.`,
            });
            return;
        } else {
            interaction.followUp({
                content: `There is no command with the name: **${name}**`,
            });
            return;
        }
    }
}
