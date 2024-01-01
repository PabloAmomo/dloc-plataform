import dotenv from 'dotenv';
import express, { Express } from 'express';
import http from 'http';
import cors from 'cors';
import routes from './routes/routes';
import { printMessage } from './functions/printMessage';
import { mySqlPersistence } from './persistence/mySql/mySqlPersistence';
import { getPersistence, setPersistence } from './persistence/persistence';
//import setRouterFeeds from './feeds/routes/routes';

/** Load environment variables */
dotenv.config();

/** Express */
const router: Express = express();
router.use(cors({ origin: '*' }));

/** Parse the request and Takes care of JSON data */
router.use(express.urlencoded({ extended: false }));
router.use(express.json());

/** Persistence */
setPersistence(new mySqlPersistence());

/** Routes - Add all Domains when needed */
routes(router);

/** Error handling */
router.use((req, res) => {
  const error = new Error('not found');
  return res.status(404).json({
    message: error.message,
  });
});


/** Server */
const httpServer = http.createServer(router);
const PORT: any = process.env.PORT ?? 8008;
const ROOT_PATH: any = process.env.ROOT_PATH ?? '';

/** Banner */
printMessage('--------------------------------------------------------------------------');
printMessage(' DLoc api listening on port ' + PORT);
printMessage('--------------------------------------------------------------------------');
printMessage(`Persistance [${getPersistence().getPersistenceName()}]`);

/** Start server */
httpServer.listen(PORT, () => printMessage(`ready... (Health check: http://localhost:${PORT}${ROOT_PATH}/health)`));
