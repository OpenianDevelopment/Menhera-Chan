import BaseEvent from "../structures/BaseEvent";
import DiscordClient from "../client/client";
import {
    Interaction,
    Message,
    MessageActionRow,
    MessageButton,
    MessageEmbed,
} from "discord.js";
import type { MessageEmbedOptions } from "discord.js";
import { CustomEmbed, _ads } from "../utils/functions/Custom";
import { exp } from "../utils/functions/exp";
import { UrlRemove } from "../utils/functions/UrlRemove";
import { getGuildTags } from "../database/functions/TagsFunctions";
import { guildTags } from "../utils/interfaces/Database";
import config from "../utils/config";

export default class messageCreateEvent extends BaseEvent {
    constructor() {
        super("messageCreate");
    }
    async run(client: DiscordClient, message: Message) {
        if (message.channel.type == "DM") return;
        if (!message.guild) return;
        if (message.author.bot) return;
        if (await UrlRemove(client, message)) return;
        exp(client, message);
        //bot prefix (for the commands)
        //regexp for replacing prefix/mention
        const MentionRegex = new RegExp(
            `^(${client.prefix}|<@(!|)${client?.user?.id}>)( +|)`,
            "i"
        );
        //commands area (if msg starts with prefix or mention)
        const Mentionconditions =
            message.content.startsWith(`<@${client?.user?.id}>`) ||
            message.content.startsWith(`<@!${client?.user?.id}>`);
        const PrefixCondition = message.content.startsWith(client.prefix);
        if (PrefixCondition || Mentionconditions) {
            if (!config.root.includes(message.author.id))
                return await and_yet_another_weird_reply();
            if (
                !message.channel
                    .permissionsFor(client.user!.id)
                    ?.has(["SEND_MESSAGES", "EMBED_LINKS"])
            )
                return;
            const [cmdName, ...cmdArgs] = message.content
                .toLowerCase()
                .replace(MentionRegex, "")
                .split(/ +/);
            //getting dev command
            const command = client.dev.get(cmdName);
            if (!command) return await and_yet_another_weird_reply();
            //checking if command requires extra args
            if (command.requireArgs && cmdArgs.length == null) {
                message.reply({ content: "This command requires extra args" });
                return;
            }
            //running command and getting the reply.
            const reply = await command.run(client, message, cmdArgs);
            if (!reply) return;
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
            reply.edit({ components: [XBtn, ...reply.components] });
            //filter so it only reacts to the author.
            const filter = (m: Interaction) => message.author.id === m.user.id;
            //creating the collector.
            const collector = message.channel.createMessageComponentCollector({
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
        //tags area
        if (message.content.startsWith("t.")) {
            const tagName = message.content.toLowerCase().slice(2);
            //getting the tags array
            const guildTags: guildTags = await getGuildTags(message.guild.id);
            const command = guildTags.tags.find((c) => c.name == tagName);
            //if no tag not found exit
            if (!command) return;
            const MsgEmbed = new MessageEmbed();
            //setting the embed
            if (command.embed) {
                const embed: MessageEmbedOptions = JSON.parse(command.embed);
                if (embed.title) {
                    MsgEmbed.setTitle(embed.title);
                }
                if (embed.description) {
                    MsgEmbed.setDescription(embed.description);
                }
                if (embed.url) {
                    MsgEmbed.setURL(embed.url);
                }
                if (embed.timestamp) {
                    MsgEmbed.setTimestamp(embed.timestamp);
                }
                if (embed.color) {
                    MsgEmbed.setColor(embed.color);
                }
                if (embed.fields) {
                    let fields = embed.fields;
                    if (embed.fields.length > 20) {
                        fields = embed.fields.slice(0, 20);
                    }
                    MsgEmbed.addFields(fields);
                }
                if (embed.author && embed.author.name) {
                    MsgEmbed.setAuthor({
                        name: embed.author.name,
                        iconURL: embed.author.iconURL,
                        url: embed.author.url,
                    });
                }
                if (embed.thumbnail && embed.thumbnail.url) {
                    MsgEmbed.setThumbnail(embed.thumbnail.url);
                }
                if (embed.image && embed.image.url) {
                    MsgEmbed.setImage(embed.image.url);
                }
                if (embed.footer && embed.footer.text) {
                    MsgEmbed.setFooter({
                        text: embed.footer.text,
                        iconURL: embed.footer.iconURL,
                    });
                }
            }
            //checking for the embed data (or if the embed is even there), to avoid errors
            if (
                command.embed &&
                (!MsgEmbed.description ||
                    !MsgEmbed.title ||
                    (MsgEmbed.author &&
                        MsgEmbed.author.name &&
                        (!MsgEmbed.author.iconURL || !MsgEmbed.author.url)) ||
                    (MsgEmbed.footer &&
                        MsgEmbed.footer.text &&
                        !MsgEmbed.footer.iconURL))
            ) {
                message.reply({
                    content: `Make sure that you created your embed correctly from ${config.links.website}/embed`,
                });
                return;
            }
            //reply if reply option is true, sent normally if reply option is false
            if (command.reply) {
                message.reply({
                    content: command.content,
                    embeds: command.embed ? [MsgEmbed] : [],
                });
                return;
            } else {
                message.channel.send({
                    content: command.content,
                    embeds: command.embed ? [MsgEmbed] : [],
                });
                return;
            }
            //else just give em something cute
        }
        /**
         *  weird reply, idk why but i dont wanna delete it
         *
         * p.s. i know its bad to define {@link weirdCuteEmoticons} and {@link qtEmbed} here but welp... kinda too lazy to fix (gotta give hackers a chance y'know ¯\_(ツ)_/¯)
         */
        function and_yet_another_weird_reply() {
            const weirdCuteEmoticons = [
                "(￣y▽,￣)╭",
                "§(*￣▽￣*)§",
                "ψ(._. )>",
                "(*≧︶≦))(￣▽￣* )ゞ",
                "(ಥ _ ಥ)",
                "(ง •_•)ง",
                "(●'◡'●)",
                "ლ(╹◡╹ლ)",
                "o(〃＾▽＾〃)o",
                "(✿◠‿◠)",
                "(ﾉ*ФωФ)ﾉˋ",
                "( ° ▽、° )",
                "ο(=•ω＜=)ρ⌒☆",
                "(★‿★)",
                "~(￣▽￣)~",
                "〜(￣▽￣〜)",
                "(〜￣▽￣)〜",
                "(～o￣3￣)～",
                "༼ つ ◕_◕ ༽つ",
                "(/ω＼*)……… (/ω•＼*)",
                "(^◕.◕^)",
                "/ᐠ｡ꞈ｡ᐟ\\",
                "o((>ω< ))o",
                "╰（‵□′）╯",
                "＼（〇_ｏ）／",
            ];
            const qtEmbed = new CustomEmbed(message, false)
                .setDescription(
                    `**${client.user?.tag}** doesn't support normal commands ||*yet?*||`
                )
                .setFooter({
                    text: weirdCuteEmoticons[
                        Math.floor(Math.random() * weirdCuteEmoticons.length)
                    ],
                });
            return message.reply({
                embeds: [qtEmbed],
            });
        }
    }
}
