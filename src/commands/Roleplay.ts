import BaseCommand from "../structures/BaseCommand";
import DiscordClient from "../client/client";
import { CommandInteraction, MessageEmbed } from "discord.js";
import { getRolePlayGifs } from "../database/functions/RolePlayFunctions";
import { rpTextCollection } from "../utils/Custom";

export default class RolePlayCommand extends BaseCommand {
    constructor() {
        super("rp", " ");
    }
    async run(
        client: DiscordClient,
        interaction: CommandInteraction,
        args: string[]
    ) {
        const author = interaction.user;
        const member = await interaction.guild!.members.fetch(args[1]);
        if (member.user.id == author.id) {
            const embed = new MessageEmbed().setDescription(
                "You need to provide another user not yourself!"
            );
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }
        console.log(JSON.stringify(args));
        // Defining the embed
        const embed = new MessageEmbed();
        // Getting the collection and array
        const textarray = rpTextCollection(author, member).get(args[0])!;
        // Choosing text
        const rtxt = textarray[Math.floor(Math.random() * textarray.length)];
        // Writing user's message
        var text;
        if (!args[2]) {
            text = " ";
        } else if (args[2].length > 500) {
            text = "||~ Text is too long||";
        } else {
            text = `~ ${args[2]}`;
        }
        var data;
        if (args[0] == "tsundere") {
            embed.setDescription(
                `<@!${author.id}> to <@!${member.user.id}>:\n**${rtxt}**`
            );
        } else {
            // Getting an img from mongodb
            data = (await getRolePlayGifs(args[0]))?.get("images");
            data = data[Math.floor(Math.random() * data.length)];
            embed.setImage(data).setDescription(`**${rtxt}** ${text}`);
        }
        // Finishing the embed
        embed.setFooter(
            `https://ko-fi.com/rohank05`,
            client.user?.displayAvatarURL()
        );

        return interaction.reply({ embeds: [embed] });
    }
}
