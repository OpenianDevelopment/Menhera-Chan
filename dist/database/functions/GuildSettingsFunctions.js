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
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeGuildSettings = exports.addGuildSettings = exports.getGuildSettings = void 0;
const schemas_1 = require("../schemas");
function getGuildSettings(guild_id) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield schemas_1.guildSettings.findOne({ guild_id });
        return result;
    });
}
exports.getGuildSettings = getGuildSettings;
function addGuildSettings(guild_id) {
    return __awaiter(this, void 0, void 0, function* () {
        if (yield getGuildSettings(guild_id)) {
            return;
        }
        const newGuild = new schemas_1.guildSettings({
            guild_id: guild_id,
            antiSpamModule: false,
            expModule: false,
            newsModule: false,
            welcomeModule: false,
            inviteModule: false,
        });
        newGuild.save().catch(console.error);
    });
}
exports.addGuildSettings = addGuildSettings;
function removeGuildSettings(guild_id) {
    return __awaiter(this, void 0, void 0, function* () {
        schemas_1.guildSettings.findOneAndRemove({ guild_id }).catch(console.error);
    });
}
exports.removeGuildSettings = removeGuildSettings;
