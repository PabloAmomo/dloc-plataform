"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.mySqlConnectionConfig = void 0;
const dotenv_1 = require("dotenv");
(0, dotenv_1.configDotenv)();
const mySqlConnectionConfig = {
    host: `${process.env.MYSQL_HOST}`,
    user: process.env.MYSQL_USER || '',
    password: process.env.MYSQL_PASSWORD || '',
    database: process.env.MYSQL_DATABASE || '',
    port: parseInt((_a = process.env.MYSQL_PORT) !== null && _a !== void 0 ? _a : '3306'),
};
exports.mySqlConnectionConfig = mySqlConnectionConfig;
