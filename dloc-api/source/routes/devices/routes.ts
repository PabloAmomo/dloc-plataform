import express from 'express';
import { getDevices } from './getDevices';
import { getDevice } from './getDevice';
import { getPersistence } from '../../persistence/persistence';
const routers = express.Router();

routers.get('/devices', (req, res, next) => {
  const imei: string = req.query?.id?.toString() ?? '';
  const interval: number = parseInt(req.query?.interval?.toString() ?? '1') ?? 1;
  /* Get all devices with interval */
  if (imei) getDevice(imei, getPersistence()).then((response) => res.status(response.code).json(response.result));
  else getDevices(interval, getPersistence()).then((response) => res.status(response.code).json(response.result));
});

routers.get('/devices/:id', (req, res, next) => {
  const imei: string = req.params?.id;
  /** validate imei and get locations */
  if (!imei) res.status(400).json({ error: 'imei is required' });
  else getDevice(imei, getPersistence()).then((response) => res.status(response.code).json(response.result));
});

export default routers;
