import { handleConnections } from './controller/handleConnections';
import { mySqlPersistence } from './infraestucture/mySql/mySqlPersistence';
import { PersistenceResult } from './infraestucture/models/PersistenceResult';
import { printMessage } from './functions/printMessage';
import cors from 'cors';
import dotenv from 'dotenv';
import express, { Express } from 'express';
import http from 'http';
import net from 'node:net';
import routes from './routes/routes';
import { setPersistence } from './persistence/persistence';

/** Load environment variables */
dotenv.config();

/** Create server */
var serverSocket: net.Server;
var serverHttp: http.Server;

/** Express */
const router: Express = express();
router.use(cors({ origin: '*' }));
routes(router);

/** Define Persistence to use */
const persistence = new mySqlPersistence();
setPersistence(persistence);

/** Start server */
const startServer = () => {
  serverSocket = net.createServer();
  serverHttp = http.createServer(router);

  /** Clean Persistence */
  const cleanPersistence = () => {
    printMessage(`Persistence clean started...`);
    persistence.clean().then((result: PersistenceResult) => {
      if (!result.error) printMessage(`Persistence cleaned...`);
    });
  };

  /** Check PORT environment variable */
  if (!process.env.PORT_SOCKET) {
    printMessage('Error: PORT_SOCKET environment variable not defined');
    process.exit(1);
  }
  if (!process.env.PORT_HTTP) {
    printMessage('Error: PORT_HTTP environment variable not defined');
    process.exit(1);
  }

  /** Clean database every hour */
  setInterval(() => cleanPersistence(), 3600000);

  /** Handle server events */
  serverSocket.on('connection', (conn) => handleConnections(conn, persistence));
  serverSocket.on('error', (err) => {
    printMessage(`error on server [${err.message}] - restarting...`);
    try {
      serverSocket.close();
    } finally {
      serverSocket.unref();
      startServer();
    }
  });

  /** Banner */
  printMessage('--------------------------------------------------------------------------');
  printMessage(' GPS Server listening on socket port ' + process.env.PORT_SOCKET);
  printMessage(' GPS Server listening on http port ' + process.env.PORT_HTTP);
  printMessage('--------------------------------------------------------------------------');
  
  /** Check persistence */
  printMessage(`Persistence: [${persistence.getPersistenceName()}]`);
  persistence.health().then((result) => {
    if (result.error) {
      printMessage(`Persistence not ready: ${result.error.message}`);
      process.exit(1);
    }
    printMessage(`Persistence checked...`);
    cleanPersistence();
  });

  /** [socket] Start server */
  serverSocket.listen(process.env.PORT_SOCKET, () => {
    printMessage('socket ready...');
  });

  /** [http] Start server */
  serverHttp.listen(process.env.PORT_HTTP, () => printMessage(`http ready... (Health check: http://host:${process.env.PORT_HTTP}${process.env.ROOT_HTTP_PATH ?? ''}/health)`));

};

/** Entry Point */
startServer();
