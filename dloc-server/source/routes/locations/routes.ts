import express from 'express';
import { location } from './location';
import { getPersistence } from '../../persistence/persistence';
import { PositionPacket } from '../../models/PositionPacket';
const routers = express.Router();

const _location = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const imei: string = req.query?.id?.toString() ?? req.query?.imei?.toString() ?? '';
  const lat: number = parseFloat(req.query?.lat?.toString() ?? '') ?? NaN;
  const lng: number = parseFloat(req.query?.lon?.toString() ?? '') ?? NaN;
  const timestamp: string = req.query?.timestamp?.toString() ?? '';
  const speed: string = req.query?.speed?.toString() ?? '';
  const bearing: string = req.query?.bearing?.toString() ?? '';
  const batt: string = req.query?.batt?.toString() ?? '';
  const dateTimeUtc: Date | null = timestamp ? new Date(parseInt(timestamp) * 1000) : null;
  const remoteAddress: string = req.ip?.toString() ?? '';
  const gsmSignal: number = 100;
  const valid: boolean = true;
  const batteryLevel: number = batt ? parseFloat(batt) : 0;
  const directionAngle: number = bearing ? parseFloat(bearing) : 0;

  if (!imei) {
    res.status(400).json({ error: 'imei is required' });
    return;
  }
  if (dateTimeUtc === null) {
    res.status(400).json({ error: 'invalid timestamp' });
    return;
  }
  if (Number.isNaN(lat) || Number.isNaN(lng)) {
    res.status(400).json({ error: 'invalid lat or lng' });
    return;
  }

  const positionPacket: PositionPacket = {
    imei,
    remoteAddress,
    dateTimeUtc,
    valid,
    lat,
    lng,
    gsmSignal,
    speed: speed ? parseFloat(speed) : 0,
    directionAngle,
    batteryLevel,
  };

  // console.log('Location packet:', positionPacket);

  if (positionPacket.lat === null || positionPacket.lng === null) {
    res.status(400).json({ error: 'invalid lat or lng' });
    return;
  }

  location(getPersistence(), positionPacket).then((response) => res.status(response.code).json(response.result));
};

routers.post('/location', _location);
routers.get('/location', _location);

export default routers;
