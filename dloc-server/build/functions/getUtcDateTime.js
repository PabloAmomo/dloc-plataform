"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUtcDateTime = void 0;
const twoDigits_1 = require("./twoDigits");
const getUtcDateTime = (withSeparators = true) => {
    const date = new Date();
    const sepDate = (withSeparators ? "-" : "");
    const sepTime = (withSeparators ? ":" : "");
    return "" + date.getUTCFullYear() + sepDate + (0, twoDigits_1.twoDigits)(date.getUTCMonth() + 1) + sepDate + (0, twoDigits_1.twoDigits)(date.getUTCDate()) +
        (withSeparators ? " " : "") +
        (0, twoDigits_1.twoDigits)(date.getUTCHours()) + sepTime + (0, twoDigits_1.twoDigits)(date.getUTCMinutes()) + sepTime + (0, twoDigits_1.twoDigits)(date.getUTCSeconds());
};
exports.getUtcDateTime = getUtcDateTime;
