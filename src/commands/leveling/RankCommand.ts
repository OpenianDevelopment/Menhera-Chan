import { Message, MessageEmbed } from "discord.js";
import DiscordClient from "../../client/client";
import { getLevel } from "../../database/functions/levelingOperation";
import { RankCard } from "../../images/rankCard";

import { userXP } from "../../utils/interfaces/levelingInterfaces";
import { BaseCommand } from "../../utils/structures";

export default class RankCommand extends BaseCommand {
  constructor() {
    super(
      "rank",
      "Get user Rank Card",
      "leveling",
      ["r", "level"],
      "rank [user]",
      "rank"
    );
  }

  async run(client: DiscordClient, message: Message, args: Array<String>) {
    const member = message.mentions.users.first() || message.author;
    const GuildUsersXP = await getLevel(message.guild?.id);
    const usersXP = GuildUsersXP.users.sort(
      (a: userXP, b: userXP) => b.xp - a.xp
    );
    const userIndex = usersXP.findIndex((e) => {
      return e.user === member.id;
    });
    if (userIndex < 0) {
      const embed = new MessageEmbed()
        .setColor("RED")
        .setDescription(
          "❌ I don't have any data on you at this moment. Kindly gain some XP first"
        );
      await message.reply({
        embeds: [embed],
      });
      return;
    }

    const rank_card_Data = new RankCard()
      .setUsername(member.username)
      .setDiscriminator(member.discriminator)
      .setLevel(usersXP[userIndex].level)
      .setMinXP(Math.floor(Math.pow(usersXP[userIndex].level, 2) / 0.01))
      .setMaxXP(Math.floor(Math.pow(usersXP[userIndex].level + 1, 2) / 0.01))
      .setXP(usersXP[userIndex].xp)
      .setAvatar(member.displayAvatarURL({ format: "png" }))
      .setBackground(usersXP[userIndex].background)
      .setOpacity(usersXP[userIndex].opacity)
      .setTrackColor(usersXP[userIndex].trackColor)
      .setTextColor(usersXP[userIndex].textColor)
      .setRank(userIndex + 1);

    const rank_card = await rank_card_Data.build();
    await message.reply({
      files: [rank_card],
    });
  }
}
