import BaseEvent from "../structures/BaseEvent";
import DiscordClient from "../client/client";
import { CommandInteraction, Interaction } from "discord.js";
import chalk from "chalk";
import {
    _ads,
    capFirstLetter,
    getSub,
    CustomEmbed,
} from "../utils/functions/Custom";
import { econ } from "../utils/functions/econ";
import config from "../utils/config";

export default class interactionCreateEvent extends BaseEvent {
    constructor() {
        super("interactionCreate");
    }

    async run(client: DiscordClient, interaction: Interaction) {
        /**
         * Since all the commands are server based
         * we are filtering unwanted interaction
         */
        if (!interaction.inGuild()) {
            const int = interaction as CommandInteraction;
            int.reply({
                embeds: [
                    new CustomEmbed(int).setDescription(
                        `You can't use interactions in DMs.\nThough you can come at [my support server](${config.links.server}) to use me!`
                    ),
                ],
            });
            return;
        }

        // Filtering the command type
        if (!interaction.isCommand()) return;

        /**
         * Getting commands and executing it.
         */
        const cmd_name = getSub(
            client,
            interaction.commandName,
            interaction.options.getSubcommand(false),
            interaction.options.getSubcommandGroup(false)
        );
        const command = client.commands.get(cmd_name);
        if (!command) return;
        //econ stuff here
        econ(interaction,client);
        //econ end here
        const ExtraAdsCommands: string[] = ["settings view", "mod"];
        try {
            await interaction.deferReply({ ephemeral: false });
            await command.run(client, interaction);
            if (_ads.OnCooldown && ExtraAdsCommands.includes(cmd_name)) {
                interaction.channel?.send({
                    embeds: [_ads.embed(interaction)],
                });
                _ads.OnCooldown = false;
                setTimeout(function () {
                    _ads.OnCooldown = true;
                }, 1000 * 60 * 60 * 6); // 6 hours
            }
            return;
        } catch (err) {
            console.error(
                `Error in ${chalk.redBright(
                    capFirstLetter(command.name)
                )} Command`,
                err
            );
        }
    }
}
