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
exports.addRolePlayGifs = exports.getRolePlayGifs = void 0;
const schemas_1 = require("../schemas");
function getRolePlayGifs(type) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield schemas_1.rolePlay.findOne({ type });
        return result;
    });
}
exports.getRolePlayGifs = getRolePlayGifs;
function addRolePlayGifs(type, img) {
    return __awaiter(this, void 0, void 0, function* () {
        if (Array.isArray(img)) {
            img.forEach((gif) => {
                schemas_1.rolePlay
                    .updateOne({ type }, { $push: { images: gif } })
                    .catch(console.error);
            });
            return true;
        }
        else if (typeof img == "string") {
            schemas_1.rolePlay
                .updateOne({ type }, { $push: { images: img } })
                .catch(console.error);
            return true;
        }
        return false;
    });
}
exports.addRolePlayGifs = addRolePlayGifs;
