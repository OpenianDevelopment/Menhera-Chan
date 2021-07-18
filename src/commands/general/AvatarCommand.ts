import { Message, MessageEmbed, Snowflake } from "discord.js";
import DiscordClient from "../../client/client";
import { BaseCommand } from "../../utils/structures";

export default class AvatarCommand extends BaseCommand {
    constructor() {
        super(
            "avatar",
            "To get avatar",
            "general",
            ["av"],
            "av [user]",
            "avatar 534783899331461123"
        );
    }
    async run(client: DiscordClient, message: Message, args: Array<string>) {
        if (!message.guild) return;
        const member =
            message.mentions.members!.first() ||
            (await message.guild.members.fetch(args.join() as Snowflake)) ||
            message.member;
        const embed = new MessageEmbed().setImage(
            member.user.displayAvatarURL({ dynamic: true })
        );

        message.reply({ embeds: [embed] });
    }
}
