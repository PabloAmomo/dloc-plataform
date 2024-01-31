
import { Express } from 'express';
import { configDotenv } from 'dotenv';
import routesHealth from './healths/routes';
import routesLocation from './locations/routes';
configDotenv();

const ROOT_PATH = process.env.ROOT_PATH ?? '';

const routes = (router: Express) => {
  router.use(`${ROOT_PATH}/`, routesHealth);
  router.use(`${ROOT_PATH}/`, routesLocation);
}

export default routes;