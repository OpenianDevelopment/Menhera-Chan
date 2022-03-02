import BaseCommand from "../../structures/BaseCommand";
import DiscordClient from "../../client/client";
import { CheckPermsBoth } from "../../utils/functions/mod";
import {
    CommandInteraction,
    NewsChannel,
    TextChannel,
    ThreadChannel,
} from "discord.js";

export default class PingCommand extends BaseCommand {
    constructor() {
        super("mod purge", "Remove chat messages");
    }
    async run(client: DiscordClient, interaction: CommandInteraction) {
        if (!(await CheckPermsBoth(interaction, "MANAGE_MESSAGES"))) {
            return;
        }
        let ammount = interaction.options.getInteger("ammount", true);
        let SChannel = interaction.options.getChannel("channel", false);
        if (ammount < 1 || ammount > 100) {
            interaction.followUp({
                content:
                    "Invaild Ammount\n Please Provide a number Between 1 to 100",
            });
            return;
        }
        if (interaction.channel?.type == "DM") {
            interaction.followUp({
                content: "Cannot Purge DM",
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
        await channel.bulkDelete(ammount);
        interaction.followUp({
            content: `Purged ${ammount} messages in ${channel}`,
        });
    }
}
