"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleUpdateDevice = void 0;
const mySqlConnectionConfig_1 = require("../functions/mySqlConnectionConfig");
const mySqlFormatDateTime_1 = require("../functions/mySqlFormatDateTime");
const printMessage_1 = require("../../../functions/printMessage");
const mySqlQueryAsync_1 = __importDefault(require("../functions/mySqlQueryAsync"));
const connectionConfig = mySqlConnectionConfig_1.mySqlConnectionConfig;
const handleUpdateDevice = (positionPacket) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const imei = positionPacket.imei === '' ? '---------------' : positionPacket.imei;
    if (!positionPacket || !positionPacket.valid || !positionPacket.imei) {
        (0, printMessage_1.printMessage)(`[${imei}] (${positionPacket.remoteAddress}) location without valid data [valid ${positionPacket.valid}]`);
        return { results: [], error: new Error('location without valid data') };
    }
    if (positionPacket.lat == null || positionPacket.lng == null) {
        (0, printMessage_1.printMessage)(`[${imei}] (${positionPacket.remoteAddress}) location without position [lat: ${(_a = positionPacket.lat) !== null && _a !== void 0 ? _a : 'ND'} lng: ${(_b = positionPacket.lng) !== null && _b !== void 0 ? _b : 'ND'} ]`);
        return { results: [], error: new Error('location without position') };
    }
    if (positionPacket.dateTimeUtc == null) {
        (0, printMessage_1.printMessage)(`[${imei}] (${positionPacket.remoteAddress}) invalid date time (Is null)`);
        return { results: [], error: new Error('invalid date time') };
    }
    const params = [
        positionPacket.imei,
        (0, mySqlFormatDateTime_1.mySqlFormatDateTime)(positionPacket.dateTimeUtc),
        positionPacket.lat,
        positionPacket.lng,
        positionPacket.speed,
        positionPacket.directionAngle,
        positionPacket.gsmSignal,
        positionPacket.batteryLevel,
        (0, mySqlFormatDateTime_1.mySqlFormatDateTime)(positionPacket.dateTimeUtc)
    ];
    const sql = `
              REPLACE INTO device (imei, lastPositionUTC, lat, lng, speed, directionAngle, gsmSignal, batteryLevel, lastVisibilityUTC)
                VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?);  
             `;
    return (0, mySqlQueryAsync_1.default)(connectionConfig, sql, params);
});
exports.handleUpdateDevice = handleUpdateDevice;
