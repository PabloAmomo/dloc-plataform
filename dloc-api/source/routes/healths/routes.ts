import express from 'express';
import { persistenceHealth } from './persistenceHealth';
import { getPersistence } from '../../persistence/persistence';
const routers = express.Router();

routers.get('/health', (req, res, next) => res.status(200).json({ message: 'ok' }));

routers.get('/persistenceHealth', (req, res, next) => {
  /* Get all devices or device by imei */
  persistenceHealth(getPersistence()).then((response) => res.status(response.code).json(response.result));
});


export default routers;
