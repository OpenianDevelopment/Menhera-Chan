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
exports.initUserXP = exports.updateUserTextColor = exports.updateUserTrackColor = exports.updateUserOpacity = exports.updateUserBackground = exports.updateUserXP = exports.getLevel = void 0;
const schemas_1 = require("../schemas");
function getLevel(guild) {
    return __awaiter(this, void 0, void 0, function* () {
        const guildXP = yield schemas_1.levelXp.findOne({ guild });
        return guildXP;
    });
}
exports.getLevel = getLevel;
function updateUserXP(user, xp, level, guild) {
    schemas_1.levelXp
        .updateOne({ guild, "users.user": user }, {
        $set: {
            "users.$.xp": xp,
            "users.$.level": level,
        },
    })
        .catch((err) => console.log(err));
}
exports.updateUserXP = updateUserXP;
function updateUserBackground(user, guild, background) {
    schemas_1.levelXp
        .updateOne({ guild, "users.user": user }, {
        $set: {
            "users.$.background": background,
        },
    })
        .catch((err) => console.log(err));
}
exports.updateUserBackground = updateUserBackground;
function updateUserOpacity(user, guild, opacity) {
    schemas_1.levelXp
        .updateOne({ guild, "users.user": user }, {
        $set: {
            "users.$.opacity": opacity,
        },
    })
        .catch((err) => console.log(err));
}
exports.updateUserOpacity = updateUserOpacity;
function updateUserTrackColor(user, guild, trackColor) {
    schemas_1.levelXp
        .updateOne({ guild, "users.user": user }, {
        $set: {
            "users.$.trackColor": trackColor,
        },
    })
        .catch((err) => console.log(err));
}
exports.updateUserTrackColor = updateUserTrackColor;
function updateUserTextColor(user, guild, textColor) {
    schemas_1.levelXp
        .updateOne({ guild, "users.user": user }, {
        $set: {
            "users.$.textColor": textColor,
        },
    })
        .catch((err) => console.log(err));
}
exports.updateUserTextColor = updateUserTextColor;
function initUserXP(user, guild) {
    schemas_1.levelXp
        .updateOne({ guild }, {
        $push: {
            users: {
                user: user,
                xp: 0,
                level: 0,
                background: "https://cdn.discordapp.com/attachments/791301593391562752/856879146175954954/rankcard2.png",
                opacity: 0.7,
                trackColor: "#21cc87",
                textColor: "#f5deb3",
            },
        },
    })
        .catch((err) => {
        throw err;
    });
}
exports.initUserXP = initUserXP;
