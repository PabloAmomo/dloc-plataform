import { handleConnections } from './controller/handleConnections';
import { mySqlPersistence } from './infraestucture/mySql/mySqlPersistence';
import { printMessage } from './functions/printMessage';
import dotenv from 'dotenv';
import net from 'node:net';

/** Load environment variables */
dotenv.config();

/** Create server */
var server: net.Server;

/** Define Persistence to use */
const persistence = new mySqlPersistence();

/** Start server */
const startServer = () => {
  server = net.createServer();

  /** Clean Persistence */
  const cleanPersistence = () => {
    printMessage(`Persistence clean started...`);
    persistence.clean().then((result) => {
      if (!result.error) printMessage(`Persistence cleaned...`);
    });
  };

  /** Check PORT environment variable */
  if (!process.env.PORT) {
    printMessage('Error: PORT environment variable not defined');
    process.exit(1);
  }

  /** Clean database every hour */
  setInterval(() => cleanPersistence(), 3600000);

  /** Handle server events */
  server.on('connection', (conn) => handleConnections(conn, persistence));
  server.on('error', (err) => {
    printMessage(`error on server [${err.message}] - restarting...`);
    try {
      server.close();
    } finally {
      server.unref();
      startServer();
    }
  });

  /** Banner */
  printMessage('--------------------------------------------------------------------------');
  printMessage(' GPS Server listening on port ' + process.env.PORT);
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

  /** Start server */
  server.listen(process.env.PORT, () => {
    printMessage('ready...');
  });
};

/** Entry Point */
startServer();
