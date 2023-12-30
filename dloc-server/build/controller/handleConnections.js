"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleConnections = void 0;
const handlePacket_1 = require("./handlePacket");
const printMessage_1 = require("../functions/printMessage");
const remoteAddress_1 = require("../functions/remoteAddress");
const handleClose_1 = __importDefault(require("./connection/handleClose"));
const handleData_1 = __importDefault(require("./connection/handleData"));
const handleEnd_1 = __importDefault(require("./connection/handleEnd"));
const handleError_1 = __importDefault(require("./connection/handleError"));
const handleConnections = (conn, persistence) => {
    const remoteAdd = (0, remoteAddress_1.remoteAddress)(conn);
    var imei = '';
    /** New socket connection */
    (0, printMessage_1.printMessage)(`[---------------] (${remoteAdd}) new connection.`);
    /** Create event listeners for socket connection */
    conn.once('close', () => (0, handleClose_1.default)(remoteAdd));
    conn.on('end', () => (0, handleEnd_1.default)(remoteAdd));
    conn.on('error', (err) => (0, handleError_1.default)(remoteAdd, err));
    /** Handle data */
    conn.on('data', (data) => {
        var _a;
        try {
            const dataString = data.toString();
            (0, handleData_1.default)({ imei, remoteAdd, data: dataString, handlePacket: handlePacket_1.handlePacket, persistence, conn }).then((results) => (imei = results[0].imei));
        }
        catch (err) {
            conn.destroy();
            (0, printMessage_1.printMessage)(`[${imei !== '' ? imei : '---------------'}] (${remoteAdd}) error handling data (${(_a = err === null || err === void 0 ? void 0 : err.message) !== null && _a !== void 0 ? _a : 'unknown error'}) data [${data}].`);
        }
    });
};
exports.handleConnections = handleConnections;
