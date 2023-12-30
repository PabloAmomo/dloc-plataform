"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const handleConnections_1 = require("./controller/handleConnections");
const mySqlPersistence_1 = require("./infraestucture/mySql/mySqlPersistence");
const printMessage_1 = require("./functions/printMessage");
const dotenv_1 = __importDefault(require("dotenv"));
const node_net_1 = __importDefault(require("node:net"));
/** Load environment variables */
dotenv_1.default.config();
/** Create server */
var server;
/** Define Persistence to use */
const persistence = new mySqlPersistence_1.mySqlPersistence();
/** Start server */
const startServer = () => {
    server = node_net_1.default.createServer();
    if (!process.env.PORT) {
        (0, printMessage_1.printMessage)('Error: PORT environment variable not defined');
        process.exit(1);
    }
    (0, printMessage_1.printMessage)('--------------------------------------------------------------------------');
    (0, printMessage_1.printMessage)(' GPS Server listening on port ' + process.env.PORT);
    (0, printMessage_1.printMessage)('--------------------------------------------------------------------------');
    (0, printMessage_1.printMessage)(`Persistence: [${persistence.getPersistenceName()}]`);
    server.on('connection', (conn) => (0, handleConnections_1.handleConnections)(conn, persistence));
    server.on('error', (err) => {
        (0, printMessage_1.printMessage)(`error on server [${err.message}] - restarting...`);
        try {
            server.close();
        }
        finally {
            server.unref();
            startServer();
        }
    });
    server.listen(process.env.PORT, () => {
        (0, printMessage_1.printMessage)('ready...');
    });
};
/** Entry Point */
startServer();
