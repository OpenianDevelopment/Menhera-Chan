"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class BaseEvent {
    constructor(_name) {
        this._name = _name;
    }
    get name() {
        return this._name;
    }
}
exports.default = BaseEvent;
