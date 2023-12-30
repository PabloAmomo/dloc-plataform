"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.remoteAddress = void 0;
const remoteAddress = (conn) => {
    return (conn.remoteAddress + ':' + conn.remotePort).replace("::ffff:", "");
};
exports.remoteAddress = remoteAddress;
