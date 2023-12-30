"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const printMessage_1 = require("../../functions/printMessage");
const handleEnd = (remoteAddress) => {
    (0, printMessage_1.printMessage)(`(${remoteAddress}) connection closed.`);
};
exports.default = handleEnd;
