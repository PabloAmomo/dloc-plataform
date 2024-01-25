import { ConnectionConfig } from 'mysql';
import { PersistenceResult } from '../../models/PersistenceResult';
import { getErrorFromPositionPacket } from '../../functions/getErrorFromPositionPacket';
import { handleUpdateLastActivity } from './handleUpdateLastActivity';
import { mySqlConnectionConfig } from '../functions/mySqlConnectionConfig';
import { mySqlFormatDateTime } from '../functions/mySqlFormatDateTime';
import { PositionPacket } from '../../../models/PositionPacket';
import { printMessage } from '../../../functions/printMessage';
import mySqlQueryAsync from '../functions/mySqlQueryAsync';
import { mySqlGetLastPosition } from '../functions/mySqlGetLastPosition';
import { mySqlGetLastPositionDateTime } from '../functions/mySqlGetLastPositionDateTime';
import { handleAddDiscarted } from './handleAddDiscarted';

const connectionConfig: ConnectionConfig = mySqlConnectionConfig;

const handleUpdateDevice = async (positionPacket: PositionPacket): Promise<PersistenceResult> => {
  /** validate data */
  const { errorMsg, message } = getErrorFromPositionPacket(positionPacket);
  if (errorMsg !== '' || positionPacket.dateTimeUtc == null) {
    /** Update last activity */
    await handleUpdateLastActivity(positionPacket.imei, positionPacket.remoteAddress);
    printMessage(message);
    return { results: [], error: new Error(errorMsg) };
  }

  /** Check if data is not old */
  const result = await mySqlGetLastPositionDateTime(positionPacket);
  if (result.error) return result;
  if (result.results.length) {
    await handleAddDiscarted(positionPacket.imei, positionPacket.remoteAddress, 'old packet - update device', JSON.stringify(positionPacket));
    return { results: [], error: new Error('old packet - update device') };
  }

  /** Update data in device */
  const data = [
    mySqlFormatDateTime(positionPacket.dateTimeUtc),
    positionPacket.lat,
    positionPacket.lng,
    positionPacket.speed,
    positionPacket.directionAngle,
    positionPacket.gsmSignal,
    positionPacket.batteryLevel,
    mySqlFormatDateTime(positionPacket.dateTimeUtc),
  ];
  const params = [
    positionPacket.imei,
    /** insert */
    ...data,
    /** update */
    ...data,
  ];
  const sql = `INSERT INTO device (imei, lastPositionUTC, lat, lng, speed, directionAngle, gsmSignal, batteryLevel, lastVisibilityUTC)
                          VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)
                ON DUPLICATE KEY 
                UPDATE  lastPositionUTC = ?, lat = ?, lng = ?, speed = ?, directionAngle = ?, gsmSignal = ?, batteryLevel = ?, lastVisibilityUTC = ?;`;
  return mySqlQueryAsync(connectionConfig, sql, params);
};

export { handleUpdateDevice };
