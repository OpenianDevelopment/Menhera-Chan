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
const BaseCommand_1 = __importDefault(require("../../structures/BaseCommand"));
const discord_js_1 = require("discord.js");
const config_1 = __importDefault(require("../../utils/config"));
class AvatarCommand extends BaseCommand_1.default {
    constructor() {
        super("avatar", "To get avatar");
    }
    run(client, interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            const member = interaction.options.getMember("user") ||
                interaction.member;
            const embed = new discord_js_1.MessageEmbed()
                .setColor(interaction.member.displayColor)
                .setImage(member.user.displayAvatarURL({ dynamic: true, size: 1024 }))
                .setFooter(config_1.default.links.website, client.user.displayAvatarURL({ dynamic: true }))
                .setTimestamp();
            yield interaction.followUp({ embeds: [embed] });
        });
    }
}
exports.default = AvatarCommand;
