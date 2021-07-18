import { Message, MessageEmbed } from "discord.js";
import DiscordClient from "../../client/client";
import { BaseCommand } from "../../utils/structures";

export default class CommandCommand extends BaseCommand {
    constructor() {
        super(
            "command",
            "Returns one specific command info",
            "info",
            ["c"],
            "c [command | alias]",
            "command ping"
        );
    }
    async run(client: DiscordClient, message: Message, args: Array<string>) {
        var text = args.join(" ");
        const embed = new MessageEmbed();

        await getCMD(client, text, embed);
        message.reply({
            embeds: [embed],
        });
        return;
    }
}
async function getCMD(
    client: DiscordClient,
    input: string,
    embed: MessageEmbed
) {
    const cmd = client.commands.get(input.toLowerCase());
    if (!cmd || cmd.getCategory() === "dev") {
        embed.setDescription(
            `No information found for command **${input.toLowerCase()}**`
        );
        return embed;
    }
    embed
        .setColor("GREEN")
        .setDescription(
            `
        **Command name**: ${cmd.getName()}
        **Aliases**: ${
            cmd.getAliases().length > 0
                ? cmd
                      .getAliases()
                      .map((a) => `\`${a}\``)
                      .join(", ")
                : "~"
        }
        **Description**: ${cmd.getDescription()}
        **Category**: ${cmd.getCategory()}
        **Usage**: ${cmd.getUsage()}
        **Example**: ${cmd.getExample()}
        `
        )
        .setFooter(`Syntax: <> = required, [] = optional`);
    return embed;
}
