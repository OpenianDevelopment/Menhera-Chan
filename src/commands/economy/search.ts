import BaseCommand from "../../structures/BaseCommand";
import DiscordClient from "../../client/client";
import { embedMaker } from "../../utils/functions/embed";
import { getWaifu } from "../../database/functions/EconFunctions";

import {
    CommandInteraction,
    MessageEmbed
} from "discord.js";

export default class EconSearchCommand extends BaseCommand {
    constructor() {
        super("econ search", "Search for Waifu");
    }
    async run(client: DiscordClient, interaction: CommandInteraction) {
        let name = interaction.options.getString("name", true);
        var data = await getWaifu(name)
        var embeds: MessageEmbed[] = [];
        if(data.length<1){
            interaction.followUp({
                content:"Not Found"
            })
            return
        }
        data.forEach(element => {
            const embed = new MessageEmbed()
            .setTitle(`Name: ${element.name}`)
            .setDescription(`**ID**: ${element.id}\n**Price**: ${element.cost}\n**Anime**: ${element.anime}`)
            .setImage(element.image)
            embeds.push(embed)
        });
        await embedMaker(interaction,embeds,0);
    }
}