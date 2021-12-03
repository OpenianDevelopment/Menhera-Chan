"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
class DiscordClient extends discord_js_1.Client {
    constructor(options) {
        super(options);
        this._commands = new discord_js_1.Collection();
        this._events = new discord_js_1.Collection();
        this._guildSettings = new discord_js_1.Collection();
    }
    get commands() {
        return this._commands;
    }
    get events() {
        return this._events;
    }
    get guildSettings() {
        return this._guildSettings;
    }
}
exports.default = DiscordClient;
