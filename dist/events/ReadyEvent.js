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
const initialFunctions_1 = require("../utils/initialFunctions");
class ReadyEvent extends BaseEvent_1.default {
    constructor() {
        super("ready");
    }
    run(client) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`${client.user.tag} is ${chalk_1.default.bgGreen("online")}`);
            yield initialFunctions_1.cacheGuildSettings(client);
            client.user.setActivity({
                name: `${client.guilds.cache.size} Servers`,
                type: "WATCHING",
            });
        });
    }
}
exports.default = ReadyEvent;
