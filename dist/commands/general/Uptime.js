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
class UptimeCommand extends BaseCommand_1.default {
    constructor() {
        super("uptime", "Return bot's ready Date/timer");
    }
    run(client, interaction) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const time = (Date.now() - client.uptime).toString();
            const embed = new discord_js_1.MessageEmbed()
                .setColor(interaction.member.displayColor)
                .setDescription(`**Shard:** ${(_a = interaction.guild) === null || _a === void 0 ? void 0 : _a.shardId}\n**Started:** <t:${time.substring(0, time.length - 3)}:R>`)
                .setTimestamp();
            yield interaction.followUp({
                embeds: [embed],
            });
        });
    }
}
exports.default = UptimeCommand;
