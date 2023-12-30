"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatLatLng = void 0;
const formatLatLng = (value) => {
    let point = value.indexOf(".");
    let degress = value.substring(0, point - 2);
    let rest = value.substring(point - 2);
    return [parseFloat(degress), parseFloat(rest)];
};
exports.formatLatLng = formatLatLng;
