"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseUtcDateTime = void 0;
const isValidDate_1 = require("./isValidDate");
const parseUtcDateTime = (date, time) => {
    if (date == '')
        return null;
    if (time == '')
        time = '000000';
    const dateValue = new Date(`
  20${date.substring(0, 2)}-${date.substring(2, 4)}-${date.substring(4, 6)} 
  ${time.substring(0, 2)}:${time.substring(2, 4)}:${time.substring(4, 6)} UTC
  `);
    return (0, isValidDate_1.isValidDate)(dateValue) ? dateValue : null;
};
exports.parseUtcDateTime = parseUtcDateTime;
