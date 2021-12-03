"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rolePlay = void 0;
const mongoose_1 = require("mongoose");
const RolePlaySchema = new mongoose_1.Schema({
    type: {
        unique: true,
        type: String,
    },
    images: [String],
});
exports.rolePlay = mongoose_1.model("RolePlay", RolePlaySchema);
