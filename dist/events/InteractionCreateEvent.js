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
const chalk_1 = __importDefault(require("chalk"));
const Custom_1 = require("../utils/functions/Custom");
class interactionCreateEvent extends BaseEvent_1.default {
    constructor() {
        super("interactionCreate");
    }
    run(client, interaction) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            /**
             * Since all the commands are server based
             * we are filtering unwanted interaction
             */
            if (!interaction.inGuild())
                return;
            // Filtering the command type
            if (!interaction.isCommand())
                return;
            /**
             * Getting commands and executing it.
             */
            const cmd_name = Custom_1.getSub(client, interaction.commandName, interaction.options.getSubcommand(false));
            const command = client.commands.get(cmd_name);
            if (!command)
                return;
            try {
                yield interaction.deferReply({ ephemeral: false });
                yield command.run(client, interaction);
                if (Custom_1._ads.OnCooldown) {
                    (_a = interaction.channel) === null || _a === void 0 ? void 0 : _a.send({
                        embeds: [Custom_1._ads.embed(interaction.guild)],
                    });
                    Custom_1._ads.OnCooldown = false;
                    setTimeout(function () {
                        Custom_1._ads.OnCooldown = true;
                    }, 1000 * 60 * 60 * 6);
                }
                return;
            }
            catch (err) {
                console.error(`Failed in ${chalk_1.default.redBright(Custom_1.capFirstLetter(command.name) + " Command")}`, err);
            }
        });
    }
}
exports.default = interactionCreateEvent;
