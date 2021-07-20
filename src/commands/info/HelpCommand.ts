import {
    MessageActionRow,
    Message,
    MessageEmbed,
    MessageButton,
} from "discord.js";
import DiscordClient from "../../client/client";
import { BaseCommand } from "../../utils/structures";

export default class HelpCommand extends BaseCommand {
    constructor() {
        super("help", "Help Command", "info", ["h"], "help [command]", "help");
    }
    async run(client: DiscordClient, message: Message, args: Array<string>) {
        const embed = new MessageEmbed();
        if (!args.length) {
            embed
                .setTitle(message.guild!.name)
                .setDescription(
                    `You can check a commands info by using **h <command name/alias>**`
                )
                .setFooter("Click on button to open the respective page");

            const btns = new MessageActionRow().addComponents(
                new MessageButton()
                    .setCustomID("dashboard")
                    .setURL("https://dashboard.menhera-chan.in")
                    .setLabel("Dashboard")
                    .setStyle("LINK"),
                new MessageButton()
                    .setCustomID("command_list")
                    .setURL("https://www.menhera-chan.in/commands")
                    .setLabel("Command List")
                    .setStyle("LINK"),
                new MessageButton()
                    .setCustomID("support")
                    .setURL("https://www.menhera-chan.in/support")
                    .setLabel("Support")
                    .setStyle("LINK")
                    .setDisabled(
                        message.guild?.id === "735899211677041099"
                            ? true
                            : false
                    )
            );
            message.reply({ embeds: [embed], components: [btns] });
            return;
        }
        await getCMD(client, args.join(" "), embed);
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
