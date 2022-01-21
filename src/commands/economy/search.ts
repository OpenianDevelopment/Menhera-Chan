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
        await interaction.followUp({content: ``})
        var data = await getWaifu(name)
        var embeds: MessageEmbed[] = [];
        data.forEach((element: { 
                name: string;
                id:number;
                cost:string;
                anime:string;
                image:string;
            }) => {
            const embed = new MessageEmbed()
            .setTitle(`Name: ${element.name}`)
            .setDescription(`
            **ID**: ${element.id}
            **Price**: ${element.cost}
            **Anime**: ${element.anime}
            `)
            .setImage(element.image)
            embeds.push(embed)
        });
        await embedMaker(interaction,embeds,0);
    }
}