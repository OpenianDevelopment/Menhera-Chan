import BaseEvent from "../structures/BaseEvent";
import DiscordClient from "../client/client";
import { CommandInteraction, Interaction } from "discord.js";

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
        if (!interaction.isCommand()) return;
        /**
         * Getting commands and executing it.
         */
        const command = client.commands.get(interaction.commandName);
        if (command) command.run(client, interaction);
    }
}
