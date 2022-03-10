import BaseCommand from "../../structures/BaseCommand";
import DiscordClient from "../../client/client";
import { CheckPermsBoth } from "../../utils/functions/mod";
import {
    CommandInteraction,
    NewsChannel,
    TextChannel,
    ThreadChannel,
} from "discord.js";

export default class SettingsCommand extends BaseCommand {
    constructor() {
        super(
            "mod settings",
            "To set settings"
        );
    }
    async run(client: DiscordClient, interaction: CommandInteraction) {
        
    }
}