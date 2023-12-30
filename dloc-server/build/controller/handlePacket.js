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
exports.handlePacket = void 0;
const createLocationPacket_1 = require("../functions/createLocationPacket");
const getUtcDateTime_1 = require("../functions/getUtcDateTime");
const printMessage_1 = require("../functions/printMessage");
const packetParseREGEX_1 = require("../functions/packetParseREGEX");
const handlePacket = ({ imei, remoteAdd, data, persistence }) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    const noImei = 'no imei received';
    let response = { imei, error: '', response: '' };
    /** Common function to discart packet */
    const discardData = (message) => {
        response.error = message;
        persistence.addDiscarted(response.imei, remoteAdd, message, data).then((result) => {
            if (result.error)
                (0, printMessage_1.printMessage)(`[${response.imei}] (${remoteAdd}) error persisting discarted [${result.error}]`);
        });
    };
    // ---------------------------------------
    // Login Package TRVAP00xxxxIMEIxxxxxxx#
    // ---------------------------------------
    if (data.startsWith('TRVAP00')) {
        response.imei = data.replace('TRVAP00', '').replace('#', '');
        response.response = 'TRVBP00' + (0, getUtcDateTime_1.getUtcDateTime)(false) + '#';
        (0, printMessage_1.printMessage)(`[${response.imei}] (${remoteAdd}) imei [${response.imei}]`);
    }
    // ---------------------------------------
    // GPS DATA (14 or REPLY 15)
    // ---------------------------------------
    else if (data.startsWith('TRVYP14') || data.startsWith('TRVYP15')) {
        let values = (_a = data.match(packetParseREGEX_1.REGEX_PACKET_WIFI)) !== null && _a !== void 0 ? _a : [];
        if (values == null || ((_b = values === null || values === void 0 ? void 0 : values.length) !== null && _b !== void 0 ? _b : 0) == 0) {
            (0, printMessage_1.printMessage)(`[${response.imei}] (${remoteAdd}) process data without wifi [${data}]`);
            values = (_c = data.match(packetParseREGEX_1.REGEX_PACKET_NO_WIFI)) !== null && _c !== void 0 ? _c : [];
        }
        /** imei not received */
        if (response.imei == '') {
            discardData(noImei);
            return response;
        }
        /** Create location packet and persist */
        const locationPacket = (0, createLocationPacket_1.createLocationPacket)(response.imei, remoteAdd, values);
        persistence.addPosition(locationPacket).then((result) => {
            if (result.error)
                (0, printMessage_1.printMessage)(`[${response.imei}] (${remoteAdd}) error persisting position [${result.error}]`);
            // TODO: Process errors when persisting
        });
        response.response = `TRVZP${data.substring(5, 7)}#`;
    }
    // ---------------------------------------
    // Device heartbeat packet
    // ---------------------------------------
    else if (data.startsWith('TRVYP16')) {
        if (response.imei == '') {
            discardData(noImei);
            return response;
        }
        /** Process Battery level */
        if (data.length >= 18) {
            const batteryLevel = parseInt((_d = data.substring(14, 17)) !== null && _d !== void 0 ? _d : '0');
            persistence.addBatteryLevel(response.imei, remoteAdd, batteryLevel).then((result) => {
                if (result.error)
                    (0, printMessage_1.printMessage)(`[${response.imei}] (${remoteAdd}) error persisting battery level [${result.error}]`);
                // TODO: Process errors when persisting
            });
        }
        response.response = 'TRVZP16#';
    }
    // ---------------------------------------------
    // IMSI number and ICCID number of the device
    // ---------------------------------------------
    else if (data.startsWith('TRVYP02')) {
        if (response.imei == '') {
            discardData(noImei);
            return response;
        }
        response.response = 'TRVZP02#';
    }
    // ---------------------------------------------
    // UNKNOW but need response (TRVAP Packets)
    // ---------------------------------------------
    else if (data.startsWith('TRVAP14') || data.startsWith('TRVAP89')) {
        if (response.imei == '') {
            discardData(noImei);
            return response;
        }
        response.response = `TRVBP${data.substring(5, 7)}#`;
    }
    // ---------------------------------------------
    // Unknow command - Discart packet
    // ---------------------------------------------
    else {
        (0, printMessage_1.printMessage)(`[${response.imei == '' ? '---------------' : response.imei}] (${remoteAdd}) command unknown in data [${data}]`);
        discardData('commad unknown');
        return response;
    }
    /** */
    const message = response.response !== '' ? `response [${response.response}]` : `no response to send for packet [${data}]`;
    (0, printMessage_1.printMessage)(`[${response.imei}] (${remoteAdd}) ${message}`);
    /** Add history (Discarted packets not added) */
    persistence.addHistory(response.imei, remoteAdd, data).then((result) => {
        if (result.error)
            (0, printMessage_1.printMessage)(`[${response.imei}] (${remoteAdd}) error persisting history [${result.error}]`);
        // TODO: Process errors when persisting
    });
    /** Return imei */
    return response;
});
exports.handlePacket = handlePacket;
