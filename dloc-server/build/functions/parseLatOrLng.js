"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseLatOrLng = void 0;
const convertDegressToDecimal_1 = require("./convertDegressToDecimal");
const formatLanLng_1 = require("./formatLanLng");
const parseLatOrLng = (latOrLngRaw, direction) => {
    if (latOrLngRaw == '' || !direction)
        return null;
    let valData = (0, formatLanLng_1.formatLatLng)(latOrLngRaw);
    return (0, convertDegressToDecimal_1.convertDegressToDecimal)(valData[0], valData[1], 0, direction);
};
exports.parseLatOrLng = parseLatOrLng;
