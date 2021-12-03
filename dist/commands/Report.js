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
const BaseCommand_1 = __importDefault(require("../structures/BaseCommand"));
const discord_js_1 = require("discord.js");
const Custom_1 = require("../utils/functions/Custom");
class ReportCommand extends BaseCommand_1.default {
    constructor() {
        super("report", "Report a bug/user");
    }
    run(client, interaction) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const webhook = new discord_js_1.WebhookClient({ url: process.env.REPORT_WH });
            const wm = yield interaction.followUp({
                content: "You will get blacklisted if it's not a serious report",
            });
            const type = interaction.options.getSubcommand(true);
            const author = interaction.user;
            const embed = new discord_js_1.MessageEmbed()
                .setTitle("Report Type: " + Custom_1.capFirstLetter(type))
                .setFields({
                name: "Author",
                value: `${author.tag} | ${author.id}`,
            })
                .setTimestamp();
            if (type == "user") {
                const user = interaction.options.getUser("target", true);
                const reason = interaction.options.getString("reason", true);
                embed.addFields({ name: "Target", value: `${user.tag} | ${user.id}` }, { name: "Reason", value: Custom_1.clean(reason) });
            }
            else {
                embed.setDescription(Custom_1.clean(interaction.options.getString("description", true)));
            }
            yield webhook.send({
                content: `${(_a = interaction.guild) === null || _a === void 0 ? void 0 : _a.name} | ${(_b = interaction.guild) === null || _b === void 0 ? void 0 : _b.id}`,
                embeds: [embed],
            });
            discord_js_1.Util.delayFor(10e4);
            yield wm.edit({ content: `Thanks for Reporting.` });
        });
    }
}
exports.default = ReportCommand;
