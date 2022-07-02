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
            await interaction.followUp({
                content:
                    "Invaild Amount\n Please Provide a number Between 1 to 100",
            });
            return;
        }
        let channel;
        if (!SChannel) {
            channel = interaction.channel as
                | TextChannel
                | NewsChannel
                | ThreadChannel;
        } else {
            channel = SChannel as TextChannel | NewsChannel | ThreadChannel;
        }
        await channel.bulkDelete(amount);
        await interaction.followUp({
            content: `Purged ${amount} messages in ${channel}`,
        });
        return;
    },
};

export default ModPurge;
