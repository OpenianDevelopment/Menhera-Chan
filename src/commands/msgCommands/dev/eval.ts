import CommandInt from "../../../structures/BaseCommand";
import DiscordClient from "../../../client/client";
import { inspect } from "util";
import { Message, MessageAttachment } from "discord.js";
import config from "../../../utils/config";
import { clean, CustomEmbed } from "../../../utils/functions/Custom";

const Eval: CommandInt = {
    name: "eval",
    description: "dev",
    requireArgs: true,
    usage: "eval <code>",
    example: ["eval client"],
    async run(client: DiscordClient, message: Message, args: string[]) {
        if (!config.root.includes(message.author.id)) {
            return;
        }
        const tokenRegex = new RegExp(client.token!, "gi");
        const code = args.join(" ");
        let botmsg: Message;
        try {
            const start = process.hrtime();
            let evaled = code.includes("await")
                ? eval(`(async () => { ${code} })()`)
                : eval(code);
            if (evaled instanceof Promise) {
                evaled = await evaled;
            }
            if (evaled == undefined)
                throw EvalError(`Cannot evaluate the requested code`);
            const stop = process.hrtime(start);
            const response = EvalClean(
                inspect(evaled, { depth: 0 }),
                tokenRegex
            );
            const evmbed = new CustomEmbed(message, false)
                .setColor("#00FF00")
                .setTitle("Eval")
                .addField(`**Output:**`, "```js\n" + response + "\n```")
                .addField(`**Type:**`, typeof evaled)
                .setFooter({
                    text: `Time Taken: ${(stop[0] * 1e9 + stop[1]) / 1e6}ms`,
                    iconURL: client.user!.displayAvatarURL(),
                });

            if (response.length <= 1024) {
                botmsg = await message.reply({
                    embeds: [evmbed],
                });
                return botmsg;
            } else if (response.length <= 2048) {
                botmsg = await message.reply({
                    content: "```js\n" + response + "\n```",
                });
                return botmsg;
            } else {
                const output = new MessageAttachment(
                    Buffer.from(response),
                    "output.txt"
                );
                return await message.author.send({ files: [output] });
            }
        } catch (err: any) {
            const errevmbed = new CustomEmbed(message, false)
                .setColor("#FF0000")
                .setTitle(`ERROR`)
                .setDescription(
                    `\`\`\`xl\n${EvalClean(err.toString(), tokenRegex)}\n\`\`\``
                )
                .setTimestamp()
                .setFooter({
                    text: client!.user!.username,
                    iconURL: client!.user!.displayAvatarURL(),
                });
            botmsg = (await message.reply({
                embeds: [errevmbed],
            })) as Message;
            return botmsg;
        }
        function EvalClean(text: string, tokenRegex: RegExp) {
            text = clean(text).replace(
                tokenRegex,
                `NrzaMyOTI4MnU1NT3oDA1rTk4.pPizb1g.hELpb6PAi1Pewp3wAwVseI72Eo`
            );
            return text;
        }
    },
};

export default Eval;
