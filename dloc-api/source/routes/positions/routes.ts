import express from 'express';
import { getPositions } from './getPositions';
import { getPersistence } from '../../persistence/persistence';
import { convertToNumber } from '../../functions/convertToNumber';
const routers = express.Router();

routers.get('/positions', (req, res, next) => {
  const interval: number = convertToNumber((req.query?.interval)?.toString(), 1440);
  const imei: string = (req.query?.id)?.toString() ?? '';
  /** validate imei and get locations */
  if (!imei) res.status(400).json({ error: 'id is required' });
  else getPositions(imei, interval, getPersistence()).then((response) => res.status(response.code).json(response.result));
});

routers.get('/positions/:id', (req, res, next) => {
  const interval: number = convertToNumber((req.query?.interval)?.toString(), 1440);
  const imei: string = req.params?.id;
  /** validate imei and get locations */
  if (!imei) res.status(400).json({ error: 'id is required' });
  else getPositions(imei, interval, getPersistence()).then((response) => res.status(response.code).json(response.result));
});


export default routers;
