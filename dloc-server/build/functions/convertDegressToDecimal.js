"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertDegressToDecimal = void 0;
const convertDegressToDecimal = (degrees, minutes, seconds, direction) => {
    var dd = degrees + (minutes != 0 ? minutes / 60 : 0) + (seconds != 0 ? seconds / 3600 : 0);
    if ((direction === null || direction === void 0 ? void 0 : direction.toUpperCase()) == 'S' || (direction === null || direction === void 0 ? void 0 : direction.toUpperCase()) == 'W')
        dd = dd * -1;
    return dd;
};
exports.convertDegressToDecimal = convertDegressToDecimal;
