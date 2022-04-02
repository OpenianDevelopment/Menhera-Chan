import BaseEvent from "../structures/BaseEvent";
import DiscordClient from "../client/client";
import { Message } from "discord.js";
import { _ads } from "../utils/functions/Custom";
import { exp } from "../utils/functions/exp";
import { UrlRemove } from "../utils/functions/UrlRemove";

export default class messageCreateEvent extends BaseEvent {
    constructor() {
        super("messageCreate");
    }
    async run(client: DiscordClient, message: Message) {
        if (message.channel.type == "DM") return;
        if (message.author.bot) return;
        if (await UrlRemove(client, message)) return;
        exp(client, message);
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
