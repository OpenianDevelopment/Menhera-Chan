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
const RolePlayFunctions_1 = require("../database/functions/RolePlayFunctions");
const Custom_1 = require("../utils/functions/Custom");
const config_1 = __importDefault(require("../utils/config"));
class RolePlayCommand extends BaseCommand_1.default {
    constructor() {
        super("roleplay", " ");
    }
    run(client, interaction) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const author = interaction.user;
            const member = interaction.options.getMember("user", true);
            const subcmd = interaction.options.getString("type", true);
            // Writing user's message
            var user_msg = interaction.options.getString("message", false);
            user_msg ? (user_msg = `~ ` + user_msg) : (user_msg = " ");
            if (user_msg && user_msg.length > 500) {
                user_msg = "||~ Text is too long ||";
            }
            if (member.user.id == author.id) {
                const embed = new discord_js_1.MessageEmbed().setDescription("You need to provide another user not yourself!");
                yield interaction.followUp({ embeds: [embed], ephemeral: true });
                return;
            }
            // Defining the embed
            const embed = new discord_js_1.MessageEmbed();
            // Getting the collection and array
            const textarray = Custom_1.rpTextCollection(author, member).get(subcmd);
            // Choosing text
            const rtxt = textarray[Math.floor(Math.random() * textarray.length)];
            if (subcmd == "tsundere") {
                embed.setDescription(`<@!${author.id}> to <@!${member.user.id}>:\n**${rtxt}**`);
            }
            else {
                // Getting an img from mongodb
                var data = (_a = (yield RolePlayFunctions_1.getRolePlayGifs(subcmd))) === null || _a === void 0 ? void 0 : _a.get("images");
                data = data[Math.floor(Math.random() * data.length)];
                embed.setImage(data).setDescription(`**${rtxt}** ${user_msg}`);
            }
            // Finishing the embed
            embed
                .setColor(member.displayColor)
                .setFooter(config_1.default.links.website, (_b = client.user) === null || _b === void 0 ? void 0 : _b.displayAvatarURL());
            yield interaction.followUp({ embeds: [embed] });
        });
    }
}
exports.default = RolePlayCommand;
