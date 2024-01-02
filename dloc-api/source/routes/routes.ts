
import { Express } from 'express';
import { configDotenv } from 'dotenv';
import routesHealth from './healths/routes';
import routesDevices from './devices/routes';
import routesPositions from './positions/routes';
configDotenv();

const ROOT_PATH = process.env.ROOT_PATH ?? '';

const routes = (router: Express) => {
  router.use(`${ROOT_PATH}/`, routesHealth);
  router.use(`${ROOT_PATH}/`, routesDevices);
  router.use(`${ROOT_PATH}/`, routesPositions);
}

export default routes;