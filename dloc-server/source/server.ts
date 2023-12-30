import { handleConnections } from './controller/handleConnections';
import { mySqlPersistence } from './infraestucture/mySql/mySqlPersistence';
import { printMessage } from './functions/printMessage';
import dotenv from 'dotenv'
import net from 'node:net';

/** Load environment variables */
dotenv.config()

/** Create server */
var server: net.Server;

/** Define Persistence to use */
const persistence = new mySqlPersistence();

/** Start server */
const startServer = () => {
  server = net.createServer();

  if (!process.env.PORT) {
    printMessage('Error: PORT environment variable not defined');
    process.exit(1);
  }

  printMessage('--------------------------------------------------------------------------');
  printMessage(' GPS Server listening on port ' + process.env.PORT);
  printMessage('--------------------------------------------------------------------------');
  printMessage(`Persistence: [${persistence.getPersistenceName()}]`);
  
  server.on('connection', (conn) => handleConnections(conn, persistence));
  server.on('error', (err) => {
    printMessage(`error on server [${err.message}] - restarting...`);
    try {
      server.close();
    }  finally {
      server.unref();
      startServer();
    }
  });

  server.listen(process.env.PORT, () => {
    printMessage('ready...');
  });
}

/** Entry Point */
startServer();