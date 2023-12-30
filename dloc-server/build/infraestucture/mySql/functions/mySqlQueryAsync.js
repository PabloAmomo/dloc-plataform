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
Object.defineProperty(exports, "__esModule", { value: true });
const mySqlConnection_1 = require("./mySqlConnection");
/** Query database (SELECT, UPDATE, INSERT...) */
const mySqlQueryAsync = (connectionConfig, sql, values) => __awaiter(void 0, void 0, void 0, function* () {
    const response = {
        results: [],
        error: null,
    };
    try {
        const connection = (0, mySqlConnection_1.mySqlConnection)(connectionConfig);
        /** Connect to dabase */
        yield new Promise((resolve) => {
            connection.on('error', (error) => (response.error = error));
            connection.connect((error) => {
                if (error)
                    response.error = new Error(error === null || error === void 0 ? void 0 : error.code);
                resolve(0);
            });
        });
        if (response.error)
            return response;
        /** Query database */
        yield new Promise((resolve) => {
            connection.query(sql, values, (error, results) => {
                response.results = results;
                if (error)
                    response.error = new Error(error === null || error === void 0 ? void 0 : error.code);
                connection.end();
                resolve(0);
            });
        });
    }
    catch (err) {
        response.error = (err === null || err === void 0 ? void 0 : err.message) ? err : new Error('unknown error');
    }
    /** Return response */
    return response;
});
exports.default = mySqlQueryAsync;
