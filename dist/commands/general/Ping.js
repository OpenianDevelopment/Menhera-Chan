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
class PingCommand extends BaseCommand_1.default {
    constructor() {
        super("ping", "Returns Ping");
    }
    run(client, interaction) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const msg = (yield interaction.followUp({
                content: `Ponging...`,
            }));
            const embed = new discord_js_1.MessageEmbed()
                .setColor(interaction.member.displayColor)
                .setDescription(`**Shard:** ${(_a = interaction.guild) === null || _a === void 0 ? void 0 : _a.shardId}\n**Socket:** ${client.ws.ping.toFixed(2)}ms\n**Client:** ${(msg.createdTimestamp - interaction.createdTimestamp).toFixed(2)}ms`)
                .setTimestamp();
            yield msg.edit({
                content: null,
                embeds: [embed],
            });
        });
    }
}
exports.default = PingCommand;
