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
exports.handleAddBatteryLevel = void 0;
const mySqlConnectionConfig_1 = require("../functions/mySqlConnectionConfig");
const mySqlQueryAsync_1 = __importDefault(require("../functions/mySqlQueryAsync"));
const connectionConfig = mySqlConnectionConfig_1.mySqlConnectionConfig;
const handleAddBatteryLevel = (imei, remoteAddress, batteryLevel) => __awaiter(void 0, void 0, void 0, function* () {
    const params = [
        imei,
        batteryLevel,
    ];
    const sql = `REPLACE INTO device (imei, batteryLevel, lastVisibility) VALUES (?, ?, UTC_TIMESTAMP());`;
    return (0, mySqlQueryAsync_1.default)(connectionConfig, sql, params);
});
exports.handleAddBatteryLevel = handleAddBatteryLevel;
