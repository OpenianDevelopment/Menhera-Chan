import BaseCommand from "../../structures/BaseCommand";
import DiscordClient from "../../client/client";
import { inspect } from "util";
import {
    CommandInteraction,
    Interaction,
    Message,
    MessageActionRow,
    MessageAttachment,
    MessageButton,
    MessageEmbed,
} from "discord.js";
import config from "../../utils/config";

export default class EvalCommand extends BaseCommand {
    constructor() {
        super("eval", "dev");
    }
    async run(client: DiscordClient, interaction: CommandInteraction) {
        if (!config.root.includes(interaction.user.id)) {
            interaction.followUp({ content: "No, thank you", ephemeral: true });
            return;
        }
        await evaluate(client, interaction);
    }
}

async function evaluate(
    client: DiscordClient,
    interaction: CommandInteraction
) {
    const date = Date.now();
    const channel = interaction.channel;
    const code = interaction.options.data[0].value!.toString();
    const XBtn = new MessageActionRow().addComponents(
        new MessageButton()
            .setCustomId("delete-" + date)
            .setStyle("PRIMARY")
            .setEmoji("❌")
    );
    var botmsg: Message;
    try {
        const start = process.hrtime();
        var evaled = eval(code);
        if (evaled instanceof Promise) {
            evaled = await evaled;
        }
        const stop = process.hrtime(start);
        const evmbed = new MessageEmbed()
            .setColor("#00FF00")
            .setFooter({
                text: `Time Taken: ${(stop[0] * 1e9 + stop[1]) / 1e6}ms`,
                iconURL: client!.user!.displayAvatarURL()
            })
            .setTitle("Eval")
            .addField(
                `**Output:**`,
                `\`\`\`js\n${clean(inspect(evaled, { depth: 0 }))}\n\`\`\``
            )
            .addField(`**Type:**`, typeof evaled);

        const response = clean(inspect(evaled, { depth: 0 }));
        if (response.length <= 1024) {
            botmsg = (await interaction.followUp({
                embeds: [evmbed],
                components: [XBtn],
            })) as Message;
        } else if (response.length <= 2048) {
            botmsg = (await interaction.followUp({
                content: "```js\n" + response + "\n```",
                components: [XBtn],
            })) as Message;
        } else {
            const output = new MessageAttachment(
                Buffer.from(response),
                "output.txt"
            );
            await interaction.user!.send({ files: [output] });
        }
    } catch (err: any) {
        const errevmbed = new MessageEmbed()
            .setColor("#FF0000")
            .setTitle(`ERROR`)
            .setDescription(`\`\`\`xl\n${clean(err.toString())}\n\`\`\``)
            .setTimestamp()
            .setFooter({
                text: client!.user!.username,
                iconURL: client!.user!.displayAvatarURL()
            });
        botmsg = (await interaction.followUp({
            embeds: [errevmbed],
            components: [XBtn],
        })) as Message;
    }

    const filter = (m: Interaction) => interaction.user.id === m.user.id;
    const collector = interaction.channel!.createMessageComponentCollector({
        filter,
    });
    collector.on("collect", async (int) => {
        if (int.customId === "delete-" + date) {
            botmsg.delete();
            return;
        }
    });
    function clean(text: string) {
        text = text
            .replace(/`/g, `\\\`${String.fromCharCode(8203)}`)
            .replace(/@/g, `@${String.fromCharCode(8203)}`)
            .replace(
                new RegExp(client!.token!, "gi"),
                `NrzaMyOTI4MnU1NT3oDA1rTk4.pPizb1g.hELpb6PAi1Pewp3wAwVseI72Eo`
            )
            .replace(/interaction.reply/g, "channel.send")
            .replace(/int./g, "interaction.");
        return text;
    }
}
