import BaseEvent from "../structures/BaseEvent";
import DiscordClient from "../client/client";
import { Message, MessageEmbed } from "discord.js";
import type { MessageEmbedOptions } from "discord.js";
import { _ads } from "../utils/functions/Custom";
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
        if (message.content.startsWith("t.")) {
            const [tagName, ...tagArgs] = message.content
                .toLowerCase()
                .slice(2)
                .split(/\s+/);
            const guildTags: guildTags = await getGuildTags(message.guild.id);
            const command = guildTags.tags.find((c) => c.name == tagName);
            if (!command) return;
            const MsgEmbed = new MessageEmbed();
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
            }
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
        }
        const mentionRegex = new RegExp(`^<@(!|)${client.user!.id}>`, "ig");
        if (!mentionRegex.test(message.content)) {
            return;
        }
        const [cmdName, ...cmdArgs] = message.content
            .toLowerCase()
            .slice(`<@!${client.user!.id}>`.length)
            .split(/\s+/);
        /**
         *  If needed we can add normal commands
         */
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
            "o(*////▽////*)q",
            "(/ω＼*)……… (/ω•＼*)",
            "(^◕.◕^)",
            "/ᐠ｡ꞈ｡ᐟ\\",
        ];
        return message.reply({
            embeds: [
                _ads
                    .embed(message)
                    .setDescription(
                        `**${client.user?.tag}** doesn't support normal commands ||*yet?*||`
                    )
                    .setFooter({
                        text: weirdCuteEmoticons[
                            Math.floor(
                                Math.random() * weirdCuteEmoticons.length
                            )
                        ],
                    }),
            ],
        });
    }
}
