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
const discord_js_1 = require("discord.js");
const levelingOperation_1 = require("../../database/functions/levelingOperation");
const rankCard_1 = require("../../utils/leveling/rankCard");
const BaseCommand_1 = __importDefault(require("../../structures/BaseCommand"));
class RankCommand extends BaseCommand_1.default {
    constructor() {
        super("rank", "Get user Rank Card");
    }
    run(client, interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!interaction.guild)
                return;
            const member = interaction.options.getUser("user", false) || interaction.user;
            const GuildUsersXP = yield levelingOperation_1.getLevel(interaction.guild.id);
            const usersXP = GuildUsersXP.users.sort((a, b) => b.xp - a.xp);
            const userIndex = usersXP.findIndex((e) => {
                return e.user === member.id;
            });
            if (userIndex < 0) {
                const embed = new discord_js_1.MessageEmbed()
                    .setColor("RED")
                    .setDescription(`❌ I don't have any data for **${member.tag}** at this moment. Kindly gain some XP first`);
                yield interaction.followUp({
                    embeds: [embed],
                });
                return;
            }
            const rank_card_Data = new rankCard_1.RankCard()
                .setUsername(member.username)
                .setDiscriminator(member.discriminator)
                .setLevel(usersXP[userIndex].level)
                .setMinXP(Math.floor(Math.pow(usersXP[userIndex].level, 2) / 0.01))
                .setMaxXP(Math.floor(Math.pow(usersXP[userIndex].level + 1, 2) / 0.01))
                .setXP(usersXP[userIndex].xp)
                .setAvatar(member.displayAvatarURL({ format: "png" }))
                .setBackground(usersXP[userIndex].background)
                .setOpacity(usersXP[userIndex].opacity)
                .setTrackColor(usersXP[userIndex].trackColor)
                .setTextColor(usersXP[userIndex].textColor)
                .setRank(userIndex + 1);
            const rank_card = yield rank_card_Data.build();
            yield interaction.followUp({
                files: [rank_card],
            });
        });
    }
}
exports.default = RankCommand;
