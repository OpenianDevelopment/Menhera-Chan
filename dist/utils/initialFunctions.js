"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.cacheGuildSettings = exports.connectDB = exports.registerCommands = exports.registerEvents = void 0;
const path_1 = __importDefault(require("path"));
const fs_1 = require("fs");
const mongoose_1 = __importDefault(require("mongoose"));
const GuildSettingsFunctions_1 = require("../database/functions/GuildSettingsFunctions");
/**
 * Registering Events in Client#events
 * @param client {DiscordClient}
 * @param dir {string}
 */
function registerEvents(client, dir = "../events") {
    return __awaiter(this, void 0, void 0, function* () {
        const filePath = path_1.default.join(__dirname, dir);
        const files = yield fs_1.promises.readdir(filePath);
        for (const file of files) {
            if (file.endsWith(".js") || file.endsWith(".ts")) {
                const { default: Event } = yield Promise.resolve().then(() => __importStar(require(path_1.default.join(dir, file))));
                const event = new Event();
                client.events.set(event.name, event);
                client.on(event.name, event.run.bind(event, client));
            }
        }
    });
}
exports.registerEvents = registerEvents;
/**
 * Registering Command in Client#commands
 * @param client {DiscordClient}
 * @param dir {string}
 */
function registerCommands(client, dir = "../commands") {
    return __awaiter(this, void 0, void 0, function* () {
        const filePath = path_1.default.join(__dirname, dir);
        const files = yield fs_1.promises.readdir(filePath);
        for (const file of files) {
            const stat = yield fs_1.promises.lstat(path_1.default.join(filePath, file));
            if (stat.isDirectory())
                yield registerCommands(client, path_1.default.join(dir, file));
            if (file.endsWith(".js") || file.endsWith(".ts")) {
                const { default: Command } = yield Promise.resolve().then(() => __importStar(require(path_1.default.join(dir, file))));
                const command = new Command();
                client.commands.set(command.name, command);
            }
        }
    });
}
exports.registerCommands = registerCommands;
function connectDB() {
    return __awaiter(this, void 0, void 0, function* () {
        // mongoose.set("debug", { shell: true }); //I got a console raid so no
        mongoose_1.default
            .connect(process.env.MONGO_URI)
            .then(() => console.log("Connected to DB"))
            .catch(console.error);
    });
}
exports.connectDB = connectDB;
function cacheGuildSettings(client) {
    return __awaiter(this, void 0, void 0, function* () {
        const guilds = client.guilds.cache.values();
        for (const guild of guilds) {
            const guildSettings = yield GuildSettingsFunctions_1.getGuildSettings(guild.id);
            client.guildSettings.set(guild.id, {
                modulesSettings: {
                    welcomeModule: guildSettings.welcomeModule,
                    antispamModule: guildSettings.antispamModule,
                    inviteModule: guildSettings.inviteModule,
                    expModule: guildSettings.expModule,
                    newsModule: guildSettings.newsModule,
                },
            });
        }
    });
}
exports.cacheGuildSettings = cacheGuildSettings;
