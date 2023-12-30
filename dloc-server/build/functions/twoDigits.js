"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.twoDigits = void 0;
const twoDigits = (value) => {
    return value < 10 ? '0' + value : '' + value;
};
exports.twoDigits = twoDigits;
