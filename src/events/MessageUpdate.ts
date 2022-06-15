import BaseEvent from "../structures/BaseEvent";
import DiscordClient from "../client/client";
import {
    Interaction,
    Message,
    MessageActionRow,
    MessageButton,
} from "discord.js";
import { UrlRemove } from "../utils/functions/UrlRemove";
import config from "../utils/config";

export default class messageUpdateEvent extends BaseEvent {
    constructor() {
        super("messageUpdate");
    }
    async run(client: DiscordClient, oldMessage: Message, newMessage: Message) {
        if (newMessage.channel.type == "DM") return;
        if (!newMessage.guild) return;
        if (newMessage.author.bot) return;
        if (await UrlRemove(client, newMessage)) return;
        if (newMessage.createdTimestamp - 10 > oldMessage.createdTimestamp)
            return;
        //bot prefix (for the commands)
        //regexp for replacing prefix/mention
        const MentionRegex = new RegExp(
            `^(${client.prefix}|<@(!|)${client?.user?.id}>)( +|)`,
            "i"
        );
        //commands area (if msg starts with prefix or mention)
        const Mentionconditions =
            newMessage.content.startsWith(`<@${client?.user?.id}>`) ||
            newMessage.content.startsWith(`<@!${client?.user?.id}>`);
        const PrefixCondition = newMessage.content
            .toLowerCase()
            .startsWith(client.prefix);
        if (PrefixCondition || Mentionconditions) {
            if (!config.root.includes(newMessage.author.id)) return;
            if (
                !newMessage.channel
                    .permissionsFor(client.user!.id)
                    ?.has(["SEND_MESSAGES", "EMBED_LINKS"])
            )
                return;
            const [cmdName, ...cmdArgs] = newMessage.content
                .replace(MentionRegex, "")
                .split(/ +/);
            //getting command
            const command = client.msgCommands.find(
                (data) =>
                    data.name === cmdName.toLowerCase() ||
                    (data.aliases != undefined
                        ? data.aliases!.includes(cmdName.toLowerCase())
                        : false)
            );
            if (!command) return;
            if (
                command.name != "roleplay" &&
                !config.root.includes(newMessage.author.id)
            ) {
                return;
            }
            //checking if command requires extra args
            if (command.requireArgs && cmdArgs.length < 1) {
                newMessage.reply({
                    content: "This command requires extra args",
                });
                return;
            }
            //running command and getting the reply.
            const reply = await command.run(
                client,
                newMessage,
                cmdArgs,
                cmdName
            );
            if (!reply) return;
            if (command.name === "roleplay") return;
            //date in ms.
            const date = Date.now();
            const customId = `delete-${date}`;
            //x button.
            const XBtn = new MessageActionRow().addComponents(
                new MessageButton()
                    .setCustomId(customId)
                    .setStyle("PRIMARY")
                    .setEmoji(config.emojis.redCrossMark)
            );
            //editing the reply to add the x button
            reply.edit({ components: [...reply.components, XBtn] });
            //filter so it only reacts to the author.
            const filter = (m: Interaction) =>
                newMessage.author.id === m.user.id;
            //creating the collector.
            const collector =
                newMessage.channel.createMessageComponentCollector({
                    filter,
                    time: 15 * 1000,
                });
            //on collect event obv
            collector.on("collect", async (int) => {
                if (int.customId === customId) {
                    //deleting reply if user pressed on the x button, cuz like.. yeah, X-button so it deletes
                    reply.delete();
                    return;
                }
            });
            return;
        }
    }
}
