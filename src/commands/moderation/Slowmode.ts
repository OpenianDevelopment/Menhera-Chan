import BaseCommand from "../../structures/BaseCommand";
import DiscordClient from "../../client/client";
import { CheckPermsBoth } from "../../utils/functions/mod";
import {
    CommandInteraction,
    NewsChannel,
    TextChannel,
    ThreadChannel,
} from "discord.js";

export default class SlowmodeCommand extends BaseCommand {
    constructor() {
        super(
            "mod slowmode",
            "To set the slowmode of the channel the command is written in"
        );
    }
    async run(
        client: DiscordClient,
        interaction: CommandInteraction<"cached">
    ) {
        if (!(await CheckPermsBoth(interaction, "MANAGE_CHANNELS"))) {
            return;
        }
        let seconds = interaction.options.getInteger("seconds", true);
        let SChannel = interaction.options.getChannel("channel", false);
        if (seconds > 100 || seconds < 0) {
            interaction.followUp({
                content: "Invalid Time\nTime should be between 0 and 100",
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
        channel.edit({ rateLimitPerUser: seconds });
        await interaction.followUp({
            content: `${channel} is now in slowmode with ${seconds} seconds`,
        });
        return;
    }
}
