"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BaseEvent_1 = __importDefault(require("../structures/BaseEvent"));
const Custom_1 = require("../utils/functions/Custom");
class messageCreateEvent extends BaseEvent_1.default {
    constructor() {
        super("messageCreate");
    }
    run(client, message) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            if (message.channel.type == "DM")
                return;
            if (message.author.bot)
                return;
            const mentionRegex = new RegExp(`^<@(!|)${client.user.id}>`, "ig");
            if (!mentionRegex.test(message.content)) {
                return;
            }
            const [cmdName, ...cmdArgs] = message.content
                .toLowerCase()
                .slice(`<@!${client.user.id}>`.length)
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
                    Custom_1._ads
                        .embed(message.guild)
                        .setDescription(`**${(_a = client.user) === null || _a === void 0 ? void 0 : _a.tag}** doesn't support normal commands ||*yet?*||`)
                        .setFooter(weirdCuteEmoticons[Math.floor(Math.random() * weirdCuteEmoticons.length)]),
                ],
            });
        });
    }
}
exports.default = messageCreateEvent;
