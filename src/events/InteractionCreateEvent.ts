import BaseEvent from "../structures/BaseEvent";
import DiscordClient from "../client/client";
import { Interaction } from "discord.js";
import chalk from "chalk";
import { _ads, capFirstLetter } from "../utils/Custom";

export default class interactionCreateEvent extends BaseEvent {
    constructor() {
        super("interactionCreate");
    }

    async run(client: DiscordClient, interaction: Interaction) {
        /**
         * Since all the commands are server based
         * we are filtering unwanted interaction
         */
        if (!interaction.inGuild()) return;

        // Filtering the command type
        if (!interaction.isCommand()) return;

        /**
         * Getting commands and executing it.
         */
        const command = client.commands.get(interaction.commandName);
        if (!command) return;
        try {
            await interaction.deferReply({ ephemeral: false });
            await command.run(client, interaction);
            if (_ads.OnCooldown) {
                interaction.channel?.send({
                    embeds: [_ads.embed(interaction.guild!)],
                });
                _ads.OnCooldown = false;
                setTimeout(function () {
                    _ads.OnCooldown = true;
                }, 1000 * 60 * 60 * 6);
            }
            return;
        } catch (err) {
            console.error(
                `Failed in ${chalk.redBright(
                    capFirstLetter(command.name) + " Command"
                )}`,
                err
            );
        }
    }
}
