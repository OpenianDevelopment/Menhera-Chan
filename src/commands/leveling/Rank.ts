import { CommandInteraction, MessageEmbed } from "discord.js";
import DiscordClient from "../../client/client";
import { getLevel } from "../../database/functions/levelingOperation";
import { RankCard } from "../../utils/leveling/rankCard";
import { userXP } from "../../utils/interfaces/leveling";
import BaseCommand from "../../structures/BaseCommand";

export default class RankCommand extends BaseCommand {
    constructor() {
        super("rank", "Get user Rank Card");
    }

    async run(client: DiscordClient, interaction: CommandInteraction) {
        if (!interaction.guild) return;
        //remove
        if(interaction.client){
            interaction.followUp({
                content:"Command is disabled"
            })
            return
        }
        // remove
        const member = interaction.options.getUser("user", false) || interaction.user!;
        const GuildUsersXP = await getLevel(interaction.guild.id);
        const usersXP = GuildUsersXP.users.sort(
            (a: userXP, b: userXP) => b.xp - a.xp
        );
        const userIndex = usersXP.findIndex((e: any) => {
            return e.user === member.id;
        });
        if (userIndex < 0) {
            const embed = new MessageEmbed()
                .setColor("RED")
                .setDescription(
                    `❌ I don't have any data for **${member.tag}**`
                );
            await interaction.followUp({
                embeds: [embed],
            });
            return;
        }

        const rank_card_Data = new RankCard()
            .setUsername(member.username)
            .setDiscriminator(member.discriminator)
            .setLevel(usersXP[userIndex].level)
            .setMinXP(Math.floor(Math.pow(usersXP[userIndex].level, 2) / 0.01))
            .setMaxXP(
                Math.floor(Math.pow(usersXP[userIndex].level + 1, 2) / 0.01)
            )
            .setXP(usersXP[userIndex].xp)
            .setAvatar(member.displayAvatarURL({ format: "png" }))
            .setBackground(usersXP[userIndex].background)
            .setOpacity(usersXP[userIndex].opacity)
            .setTrackColor(usersXP[userIndex].trackColor)
            .setTextColor(usersXP[userIndex].textColor)
            .setRank(userIndex + 1);

        const rank_card = await rank_card_Data.build();
        await interaction.followUp({
            files: [rank_card],
        });
    }
}
