import { getPersistence } from '../../persistence/persistence';
import { location } from '../../services/server-http/location';
import { PositionPacket } from '../../models/PositionPacket';
import express from 'express';

const routesLocation = express.Router();

const handlePacket = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const imei: string = req.query?.id?.toString() ?? req.query?.imei?.toString() ?? '';
  const lat: number = parseFloat(req.query?.lat?.toString() ?? '') ?? NaN;
  const lng: number = parseFloat(req.query?.lon?.toString() ?? '') ?? NaN;
  const timestamp: string = req.query?.timestamp?.toString() ?? '';
  const speedValue: string = req.query?.speed?.toString() ?? '0';
  const bearing: string = req.query?.bearing?.toString() ?? '';
  const batt: string = req.query?.batt?.toString() ?? '';
  const dateTimeUtc: Date | null = timestamp ? new Date(parseInt(timestamp) * 1000) : null;
  const remoteAddress: string = req.ip?.toString() ?? '';
  const gsmSignal: number = 100;
  const valid: boolean = true;
  const batteryLevel: number = batt ? parseFloat(batt) : 0;
  const directionAngle: number = bearing ? parseFloat(bearing) : 0;

  let error: string = '';
  if (!imei) error = 'imei is required';
  else if (dateTimeUtc === null) error = 'invalid timestamp';
  else if (lat === null || lng === null || Number.isNaN(lat) || Number.isNaN(lng)) error = 'invalid lat or lng';
  
  /** Return error */
  if (error !== '') return res.status(400).json({ error: 'invalid lat or lng' });

  let speed: number = Number.isNaN(speedValue) ? parseFloat(speedValue) : 0;

  const positionPacket: PositionPacket = { imei, remoteAddress, dateTimeUtc, valid, lat, lng, gsmSignal, speed, directionAngle, batteryLevel };

  location(getPersistence(), positionPacket).then((response) => res.status(response.code).json(response.result));
};

routesLocation.post('/location', handlePacket);
routesLocation.get('/location', handlePacket);

export default routesLocation;
