import BaseEvent from "../structures/BaseEvent";
import DiscordClient from "../client/client";
import { CommandInteraction, Interaction } from "discord.js";
import chalk from "chalk";
import {
    _ads,
    capFirstLetters,
    getSub,
    CustomEmbed,
    ReportBug,
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

        // Getting command name
        const cmd_name = getSub(
            client,
            interaction.commandName,
            interaction.options.getSubcommand(false),
            interaction.options.getSubcommandGroup(false)
        );
        // Getting command
        const command = client.commands.get(cmd_name);
        // check if command exists
        if (!command) return;
        //econ stuff here
        econ(interaction, client);
        //econ end here
        try {
            // defer interaction reply and run command
            await interaction.deferReply({ ephemeral: false });
            await command.run(client, interaction);
            // runs last
            if (!config.root.includes(interaction.user.id)) {
                setImmediate(() => {
                    // check if ads are not on cd and command is not a mod command
                    if (!_ads.OnCooldown && cmd_name.includes("mod")) {
                        interaction.channel?.send({
                            embeds: [_ads.embed(interaction)],
                        });
                        _ads.OnCooldown = true;
                        setTimeout(function () {
                            _ads.OnCooldown = false;
                        }, 1000 * 60 * 60 * 6); // 6 hours
                    }
                });
            }
            return;
        } catch (err) {
            /**
             * logging errors to console (Can be changed to {@link ReportBug})
             */
            console.error(
                `Error in ${chalk.redBright(
                    capFirstLetters(command.name)
                )} Command`,
                err
            );
        }
    }
}
