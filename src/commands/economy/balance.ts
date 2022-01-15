import BaseCommand from "../../structures/BaseCommand";
import DiscordClient from "../../client/client";
import { getBalance } from "../../database/functions/EconFunctions";

import {
    CommandInteraction,
    Message,
    MessageEmbed,
    Util,
    GuildMember,
    WebhookClient,
} from "discord.js";

export default class EconBalanceCommand extends BaseCommand {
    constructor() {
        super("econ balance", "Shows Balance");
    }
    async run(client: DiscordClient, interaction: CommandInteraction) {
        var balance = await getBalance(interaction.member?.user.id!)
        var embed = new MessageEmbed()
        .setTitle(`${interaction.member?.user.username}'s Balance`)
        .setDescription(`Coins:\n${balance.balance}`)
        
        await interaction.followUp({embeds:[embed]})
    }
}