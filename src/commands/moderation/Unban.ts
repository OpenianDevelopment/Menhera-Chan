import BaseCommand from "../../structures/BaseCommand";
import DiscordClient from "../../client/client";
import { CheckPermsBoth } from "../../utils/functions/mod";
import { CommandInteraction, MessageEmbed } from "discord.js";
import { clean, CustomEmbed } from "../../utils/functions/Custom";
import config from "../../utils/config";

export default class BanCommand extends BaseCommand {
    constructor() {
        super("mod unban", "unbans a member");
    }

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
            await interaction.followUp({
                content: "I can't moderate myself",
            });
            return;
        }
        if (!(await interaction.guild?.bans.fetch(user))) {
            await interaction.followUp({
                content: "Cannot Unban user. User is not banned",
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
            interaction.followUp({
                content: "Cannot send messages to this user",
            });
        });

        const ChannelEmbed = new MessageEmbed()
            .setDescription(
                `${config.emojis.whiteHeavyCheckMark} Unbanned **${user.tag}** `
            )
            .setColor("GREEN");
        await interaction.followUp({ embeds: [ChannelEmbed] });
        await interaction.guild!.members.unban(user);
        return;
    }
}
