import BaseCommand from "../structures/BaseCommand";
import DiscordClient from "../client/client";
import { CommandInteraction, GuildMember, MessageEmbed } from "discord.js";
import { getRolePlayGifs } from "../database/functions/RolePlayFunctions";
import { rpTextCollection } from "../utils/functions/Custom";

export default class RolePlayCommand extends BaseCommand {
    constructor() {
        super("roleplay", " ");
    }
    async run(client: DiscordClient, interaction: CommandInteraction) {
        const author = interaction.user;
        const member = interaction.options.getMember(
            "user",
            true
        ) as GuildMember;
        const subcmd = interaction.options.getString("type", true);
        // Writing user's message
        var user_msg = interaction.options.getString("message", false);
        user_msg ? (user_msg = `~ ` + user_msg) : (user_msg = " ");
        if (user_msg && user_msg.length > 500) {
            user_msg = "||~ Text is too long ||";
        }
        if (member.user.id == author.id) {
            const embed = new MessageEmbed().setDescription(
                "You need to provide another user not yourself!"
            );
            await interaction.followUp({ embeds: [embed], ephemeral: true });
            return;
        }
        // Defining the embed
        const embed = new MessageEmbed();
        // Getting the collection and array
        const textarray = rpTextCollection(author, member).get(
            subcmd as RpTypes
        )!;
        // Choosing text
        const rtxt = textarray[Math.floor(Math.random() * textarray.length)];
        if (subcmd == "tsundere") {
            embed.setDescription(
                `<@!${author.id}> to <@!${member.user.id}>:\n**${rtxt}**`
            );
        } else {
            // Getting an img from mongodb
            var data = (await getRolePlayGifs(subcmd))?.get("images");
            data = data[Math.floor(Math.random() * data.length)];
            embed.setImage(data).setDescription(`**${rtxt}** ${user_msg}`);
        }
        // Finishing the embed
        embed
            .setColor(member.displayColor)
            .setFooter(
                "https://menhera.openian.dev",
                client.user?.displayAvatarURL()
            );

        await interaction.followUp({ embeds: [embed] });
    }
}
