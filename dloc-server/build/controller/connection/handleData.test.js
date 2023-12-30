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
const node_assert_1 = __importDefault(require("node:assert"));
const node_test_1 = __importDefault(require("node:test"));
const mySqlPersistence_1 = require("../../infraestucture/mySql/mySqlPersistence");
const handleData_1 = __importDefault(require("./handleData"));
const handlePacket_1 = require("../handlePacket");
const persistence = new mySqlPersistence_1.mySqlPersistence();
(0, node_test_1.default)('Simulate command [TRVYP16]', () => __awaiter(void 0, void 0, void 0, function* () {
    const imei = '869207032612724';
    const remoteAdd = '127.0.0.1';
    const data = 'TRVYP16,10000002300010120000204000099992#';
    yield (0, handleData_1.default)({
        imei,
        remoteAdd,
        data,
        handlePacket: handlePacket_1.handlePacket,
        persistence,
        conn: {
            write: (data) => {
                node_assert_1.default.equal(data.startsWith('TRVZP16'), true);
            },
            destroy: () => {
                node_assert_1.default.ok(false, 'connection closed');
            },
        },
    }).then((results) => {
        node_assert_1.default.equal(results.length, 1);
        node_assert_1.default.equal(results[0].response.startsWith('TRVZP16'), true);
        node_assert_1.default.equal(results[0].response.endsWith('#'), true);
    });
}));
(0, node_test_1.default)('Simulate command [TRVYP02]', () => __awaiter(void 0, void 0, void 0, function* () {
    const imei = '869207032612724';
    const remoteAdd = '127.0.0.1';
    const data = 'TRVYP02,214042006963593,8934041422092533560F#';
    yield (0, handleData_1.default)({
        imei,
        remoteAdd,
        data,
        handlePacket: handlePacket_1.handlePacket,
        persistence,
        conn: {
            write: (data) => {
                node_assert_1.default.equal(data.startsWith('TRVZP02'), true);
            },
            destroy: () => {
                node_assert_1.default.ok(false, 'connection closed');
            },
        },
    }).then((results) => {
        node_assert_1.default.equal(results.length, 1);
        node_assert_1.default.equal(results[0].response.startsWith('TRVZP02'), true);
        node_assert_1.default.equal(results[0].response.endsWith('#'), true);
    });
}));
(0, node_test_1.default)('Simulate command [TRVAP89]', () => __awaiter(void 0, void 0, void 0, function* () {
    const imei = '869207032612724';
    const remoteAdd = '127.0.0.1';
    const data = 'TRVAP89,000001,1,0#';
    yield (0, handleData_1.default)({
        imei,
        remoteAdd,
        data,
        handlePacket: handlePacket_1.handlePacket,
        persistence,
        conn: {
            write: (data) => {
                node_assert_1.default.equal(data.startsWith('TRVBP89'), true);
            },
            destroy: () => {
                node_assert_1.default.ok(false, 'connection closed');
            },
        },
    }).then((results) => {
        node_assert_1.default.equal(results.length, 1);
        node_assert_1.default.equal(results[0].response.startsWith('TRVBP89'), true);
        node_assert_1.default.equal(results[0].response.endsWith('#'), true);
    });
}));
(0, node_test_1.default)('Simulate command [TRVAP14]', () => __awaiter(void 0, void 0, void 0, function* () {
    const imei = '869207032612724';
    const remoteAdd = '127.0.0.1';
    const data = 'TRVAP14,214,03,6103,4445#';
    yield (0, handleData_1.default)({
        imei,
        remoteAdd,
        data,
        handlePacket: handlePacket_1.handlePacket,
        persistence,
        conn: {
            write: (data) => {
                node_assert_1.default.equal(data.startsWith('TRVBP14'), true);
            },
            destroy: () => {
                node_assert_1.default.ok(false, 'connection closed');
            },
        },
    }).then((results) => {
        node_assert_1.default.equal(results.length, 1);
        node_assert_1.default.equal(results[0].response.startsWith('TRVBP14'), true);
        node_assert_1.default.equal(results[0].response.endsWith('#'), true);
    });
}));
(0, node_test_1.default)('Simulate command [TRVYP14] (TWO PACKETS VALID DATA AND INVALID DATA)', () => __awaiter(void 0, void 0, void 0, function* () {
    const imei = '869207032612724';
    const remoteAdd = '127.0.0.1';
    const data = 'TRVYP14231229A3933.7865N00241.3590E070.8160722109.470830120000000100004,214,03,6100,3626#TRVYP14040101V0000.0000N00000.0000E000.0001228000.001000000040000200004,214,03,6103,4444#';
    yield (0, handleData_1.default)({
        imei,
        remoteAdd,
        data,
        handlePacket: handlePacket_1.handlePacket,
        persistence,
        conn: {
            write: (data) => {
                node_assert_1.default.equal(data.startsWith('TRVZP14'), true);
            },
            destroy: () => {
                node_assert_1.default.ok(false, 'connection closed');
            },
        },
    }).then((results) => {
        node_assert_1.default.equal(results.length, 2);
        node_assert_1.default.equal(results[0].response.startsWith('TRVZP14'), true);
        node_assert_1.default.equal(results[0].response.endsWith('#'), true);
        node_assert_1.default.equal(results[1].response.startsWith('TRVZP14'), true);
        node_assert_1.default.equal(results[1].response.endsWith('#'), true);
    });
}));
(0, node_test_1.default)('Simulate command [TRVYP14] (VALID DATA)', () => __awaiter(void 0, void 0, void 0, function* () {
    const imei = '869207032612724';
    const remoteAdd = '127.0.0.1';
    const data = 'TRVYP14231229A3933.7865N00241.3590E070.8160722109.470830120000000100004,214,03,6100,3626#';
    yield (0, handleData_1.default)({
        imei,
        remoteAdd,
        data,
        handlePacket: handlePacket_1.handlePacket,
        persistence,
        conn: {
            write: (data) => {
                node_assert_1.default.equal(data.startsWith('TRVZP14'), true);
            },
            destroy: () => {
                node_assert_1.default.ok(false, 'connection closed');
            },
        },
    }).then((results) => {
        node_assert_1.default.equal(results.length, 1);
        node_assert_1.default.equal(results[0].response.startsWith('TRVZP14'), true);
        node_assert_1.default.equal(results[0].response.endsWith('#'), true);
    });
}));
(0, node_test_1.default)('Simulate command [TRVYP14] (INVALID DATA)', () => __awaiter(void 0, void 0, void 0, function* () {
    const imei = '869207032612724';
    const remoteAdd = '127.0.0.1';
    const data = 'TRVYP14040101V0000.0000N00000.0000E000.0001228000.001000000040000200004,214,03,6103,4444#';
    yield (0, handleData_1.default)({
        imei,
        remoteAdd,
        data,
        handlePacket: handlePacket_1.handlePacket,
        persistence,
        conn: {
            write: (data) => {
                node_assert_1.default.equal(data.startsWith('TRVZP14'), true);
            },
            destroy: () => {
                node_assert_1.default.ok(false, 'connection closed');
            },
        },
    }).then((results) => {
        node_assert_1.default.equal(results.length, 1);
        node_assert_1.default.equal(results[0].response.startsWith('TRVZP14'), true);
        node_assert_1.default.equal(results[0].response.endsWith('#'), true);
    });
}));
(0, node_test_1.default)('Simulate command [INVALID] - Check discard', () => __awaiter(void 0, void 0, void 0, function* () {
    const imei = '';
    const remoteAdd = '127.0.0.1';
    const data = 'INVALID-PACKET';
    yield (0, handleData_1.default)({
        imei,
        remoteAdd,
        data,
        handlePacket: handlePacket_1.handlePacket,
        persistence,
        conn: {
            write: (data) => { },
            destroy: () => { },
        },
    }).then((results) => {
        node_assert_1.default.equal(results.length, 1);
        node_assert_1.default.equal(results[0].error, 'commad unknown');
    });
}));
(0, node_test_1.default)('Simulate command [TRVAP00] - start connection', () => __awaiter(void 0, void 0, void 0, function* () {
    const imei = '';
    const remoteAdd = '127.0.0.1';
    const data = 'TRVAP00869207032612724#';
    yield (0, handleData_1.default)({
        imei,
        remoteAdd,
        data,
        handlePacket: handlePacket_1.handlePacket,
        persistence,
        conn: {
            write: (data) => {
                node_assert_1.default.equal(data.startsWith('TRVBP0020'), true);
            },
            destroy: () => {
                node_assert_1.default.ok(false, 'connection closed');
            },
        },
    }).then((results) => {
        node_assert_1.default.equal(results.length, 1);
        node_assert_1.default.equal(results[0].response.startsWith('TRVBP00'), true);
        node_assert_1.default.equal(results[0].response.endsWith('#'), true);
        node_assert_1.default.equal(results[0].response.length, 22);
        node_assert_1.default.equal(results[0].imei, '869207032612724');
    });
}));
