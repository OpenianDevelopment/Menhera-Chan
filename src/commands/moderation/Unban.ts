import CommandInt from "../../structures/BaseCommand";
import DiscordClient from "../../client/client";
import { CheckPermsBoth } from "../../utils/functions/mod";
import { CommandInteraction, MessageEmbed } from "discord.js";
import { clean, CustomEmbed } from "../../utils/functions/Custom";
import config from "../../utils/config";

const ModUnban: CommandInt = {
    name: "mod unban",
    description: "unbans a member",
    async run(
        client: DiscordClient,
        interaction: CommandInteraction<"cached">
    ) {
        if (!(await CheckPermsBoth(interaction, "BAN_MEMBERS"))) {
            return;
        }
        const user = interaction.options.getUser("user", true);
        const reason =
            interaction.options.getString("reason", false) ||
            "No Reason Provided";
        if (user.id == client.user?.id) {
            await interaction.reply({
                content: "I can't moderate myself",
                ephemeral: true
            });
            return;
        }
        if (!(await interaction.guild?.bans.fetch(user))) {
            await interaction.reply({
                content: "Cannot Unban user. User is not banned",
                ephemeral: true
            });
            return;
        }
        const MemberEmbed = new CustomEmbed(interaction, false)
            .setAuthor({
                name: user.tag,
                iconURL: user.displayAvatarURL({ dynamic: true }),
            })
            .setDescription(
                `You got Unbanned from **${clean(interaction.guild?.name)}**!`
            )
            .addField("Reason", reason)
            .setColor("RED");
        user.send({
            embeds: [MemberEmbed],
        }).catch((err) => {
            interaction.reply({
                content: "Cannot send messages to this user",
                ephemeral: true
            });
        });

        const ChannelEmbed = new MessageEmbed()
            .setDescription(
                `${config.emojis.whiteHeavyCheckMark} Unbanned **${user.tag}** `
            )
            .setColor("GREEN");
        await interaction.reply({ embeds: [ChannelEmbed] });
        await interaction.guild!.members.unban(user);
        return;
    },
};

export default ModUnban;
