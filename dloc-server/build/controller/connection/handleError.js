"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const printMessage_1 = require("../../functions/printMessage");
const handleError = (remoteAddress, err) => {
    (0, printMessage_1.printMessage)(`(${remoteAddress}) connection error: [${err.message}]`);
};
exports.default = handleError;
