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
const printMessage_1 = require("../../functions/printMessage");
const handleData = ({ imei, remoteAdd, data, handlePacket, persistence, conn }) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    /** Save results */
    const results = [];
    /** broke data into packets (Sometimes more than one packet is received) */
    const inPackets = (data !== null && data !== void 0 ? data : '').split('#');
    /** Process each packet */
    for (let i = 0; i < inPackets.length; i++) {
        /** Discart empty packets */
        if (inPackets[i] == '')
            continue;
        /** Handle packet */
        try {
            yield handlePacket({ imei, remoteAdd, data: inPackets[i] + '#', persistence }).then((result) => {
                /** Save result */
                results.push(result);
                /** Error handling packet */
                if (result.error !== '')
                    throw new Error(result.error);
                /** Update imei */
                imei = result.imei;
                /** Send response */
                if (result.response !== '' && conn)
                    conn.write(result.response);
            });
        }
        catch (err) {
            const printImei = imei !== '' ? imei : '---------------';
            (0, printMessage_1.printMessage)(`[${printImei}] (${remoteAdd}) error handling packet (${(_a = err === null || err === void 0 ? void 0 : err.message) !== null && _a !== void 0 ? _a : 'unknown error'}) packet [${inPackets[i]}]}]`);
            /** Close connection */
            conn && conn.destroy();
        }
    }
    /** Return results */
    return results;
});
exports.default = handleData;
