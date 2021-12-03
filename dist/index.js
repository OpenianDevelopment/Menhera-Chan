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
const client_1 = __importDefault(require("./client/client"));
const initialFunctions_1 = require("./utils/initialFunctions");
require("dotenv").config();
const client = new client_1.default({
    intents: [
        "GUILDS",
        "GUILD_BANS",
        "GUILD_INVITES",
        "GUILD_VOICE_STATES",
        "GUILD_MEMBERS",
        "GUILD_MESSAGES",
    ],
});
(() => __awaiter(void 0, void 0, void 0, function* () {
    yield initialFunctions_1.registerEvents(client);
    yield initialFunctions_1.registerCommands(client);
    yield initialFunctions_1.connectDB();
    yield client.login(process.env.TOKEN);
}))();
