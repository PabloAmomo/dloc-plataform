"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createLocationPacket = void 0;
const parseLatOrLng_1 = require("./parseLatOrLng");
const parseUtcDateTime_1 = require("./parseUtcDateTime");
const createLocationPacket = (imei, remoteAdd, values) => {
    var _a, _b, _c, _d, _e, _f, _g;
    return {
        imei,
        remoteAddress: remoteAdd,
        dateTimeUtc: (0, parseUtcDateTime_1.parseUtcDateTime)(values[2], values[9]),
        valid: (((_a = values[3]) !== null && _a !== void 0 ? _a : '').toUpperCase().trim()) === 'A',
        lat: (0, parseLatOrLng_1.parseLatOrLng)(values[4], values[5]),
        lng: (0, parseLatOrLng_1.parseLatOrLng)(values[6], values[7]),
        latRaw: values[4],
        latRawDirection: values[5],
        lngRaw: values[6],
        lngRawDirection: values[7],
        speed: parseInt((_b = values[8]) !== null && _b !== void 0 ? _b : '0'),
        directionAngle: parseInt((_c = values[10]) !== null && _c !== void 0 ? _c : '0'),
        gsmSignal: parseInt((_d = values[11]) !== null && _d !== void 0 ? _d : '0'),
        numberOfSatelites: parseInt((_e = values[12]) !== null && _e !== void 0 ? _e : '0'),
        batteryLevel: parseInt((_f = values[13]) !== null && _f !== void 0 ? _f : '0'),
        ACCStatus: values[14],
        defenseStatus: values[15],
        workingStatus: values[16],
        oilSwitch: values[17],
        electricSwitch: values[18],
        assemblyState: values[19],
        alarmFlags: values[20],
        voiceControlRecording: values[21],
        // LBS info
        MCCCountryCode: values[22],
        MNC: values[23],
        lAC: values[24],
        cID: values[25],
        // Wifi
        wifi: (_g = values === null || values === void 0 ? void 0 : values[26]) !== null && _g !== void 0 ? _g : '',
    };
};
exports.createLocationPacket = createLocationPacket;
