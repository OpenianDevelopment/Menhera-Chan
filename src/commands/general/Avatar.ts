import BaseCommand from "../../structures/BaseCommand";
import DiscordClient from "../../client/client";
import { CommandInteraction, MessageEmbed } from "discord.js";

export default class AvatarCommand extends BaseCommand {
    constructor() {
        super("avatar", "To get avatar");
    }
    async run(
        client: DiscordClient,
        interaction: CommandInteraction,
        args: string[]
    ) {
        const user = args[0]
            ? await client.users.fetch(args[0])
            : interaction.user;

        const embed = new MessageEmbed()
            .setAuthor(user.tag, undefined, "https://ko-fi.com/rohank05")
            .setImage(user.displayAvatarURL({ dynamic: true, size: 512 }))
            .setFooter(
                "https://ko-fi.com/rohank05",
                client.user?.displayAvatarURL()
            );
        return await interaction.reply({ embeds: [embed] });
    }
}
