"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mySqlConnection = void 0;
const mysql_1 = __importDefault(require("mysql"));
const mySqlConnection = (ConnectionConfig) => mysql_1.default.createConnection(ConnectionConfig);
exports.mySqlConnection = mySqlConnection;
