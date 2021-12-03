"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class BaseCommand {
    constructor(_name, _description) {
        this._name = _name;
        this._description = _description;
    }
    get name() {
        return this._name;
    }
    get description() {
        return this._description;
    }
}
exports.default = BaseCommand;
