import BaseEvent from "../structures/BaseEvent";
import DiscordClient from "../client/client";
import { Interaction, MessageEmbed } from "discord.js";
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
        if (interaction.isCommand()) {
            const args: string[] = [];

            for (const option of interaction.options.data) {
                if (option.type === "SUB_COMMAND") {
                    if (option.name) args.push(option.name);
                    option.options?.forEach((x) => {
                        if (x.value) args.push(x.value.toString());
                    });
                } else if (option.value) {
                    args.push(option.value.toString());
                }
            }
            /**
             * Getting commands and executing it.
             */
            const command = client.commands.get(interaction.commandName);
            if (command) {
                try {
                    if (_ads.OnCooldown) {
                        interaction.channel?.send({
                            embeds: [_ads.embed(interaction.guild!)],
                        });
                        _ads.OnCooldown = false;
                        setTimeout(function () {
                            _ads.OnCooldown = true;
                        }, 1000 * 60 * 60 * 6);
                    }
                    await command.run(client, interaction, args);
                } catch (err) {
                    console.log(
                        `Failed in ${chalk.redBright(
                            capFirstLetter(command.name) + " Command"
                        )}`,
                        err
                    );
                }
                return;
            } else {
                return interaction.reply({
                    embeds: [
                        new MessageEmbed()
                            .setColor("RED")
                            .setDescription(
                                "❗ Interaction is not found, Please [contact the developers](https://discord.gg/r7vfnGY)"
                            )
                            .setFooter(
                                "https://ko-fi.com/rohank05",
                                client.user!.displayAvatarURL()
                            ),
                    ],
                });
            }
        }
    }
}
