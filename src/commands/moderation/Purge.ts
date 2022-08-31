import CommandInt from "../../structures/BaseCommand";
import DiscordClient from "../../client/client";
import { CheckPermsBoth } from "../../utils/functions/mod";
import {
    CommandInteraction,
    NewsChannel,
    TextChannel,
    ThreadChannel,
} from "discord.js";

const ModPurge: CommandInt = {
    name: "mod purge",
    description: "Remove chat messages",
    async run(
        client: DiscordClient,
        interaction: CommandInteraction<"cached">
    ) {
        if (!(await CheckPermsBoth(interaction, "MANAGE_MESSAGES"))) {
            return;
        }
        let amount = interaction.options.getInteger("amount", true);
        let SChannel = interaction.options.getChannel("channel", false);
        if (amount < 1 || amount > 100) {
            await interaction.reply({
                content:
                    "Invaild Amount\nPlease Provide a number Between 1 to 100",
                    ephemeral: true
                });
            return;
        }
        let channel: TextChannel | NewsChannel | ThreadChannel;
        if (!SChannel) {
            channel = interaction.channel as
                | TextChannel
                | NewsChannel
                | ThreadChannel;
        } else {
            channel = SChannel as TextChannel | NewsChannel | ThreadChannel;
        }
        await interaction.reply({
            content: `Purged ${amount} messages in ${channel}`,
            ephemeral: true,
        });
        if (!(await channel.bulkDelete(amount))) {
            interaction.editReply({
                content:
                    "There was an error, please check that i have the correct permissions.\nThank you.",
            });
        }
        return;
    },
};

export default ModPurge;
