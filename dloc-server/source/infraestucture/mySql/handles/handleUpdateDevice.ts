import { ConnectionConfig } from 'mysql';
import { PersistenceResult } from '../../models/PersistenceResult';
import { getErrorFromPositionPacket } from '../../functions/getErrorFromPositionPacket';
import { handleUpdateLastActivity } from './handleUpdateLastActivity';
import { mySqlConnectionConfig } from '../functions/mySqlConnectionConfig';
import { mySqlFormatDateTime } from '../functions/mySqlFormatDateTime';
import { PositionPacket } from '../../../models/PositionPacket';
import { printMessage } from '../../../functions/printMessage';
import mySqlQueryAsync from '../functions/mySqlQueryAsync';

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
    ...data
  ];
  const sql = `INSERT INTO device (imei, lastPositionUTC, lat, lng, speed, directionAngle, gsmSignal, batteryLevel, lastVisibilityUTC)
                          VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)
                ON DUPLICATE KEY 
                UPDATE  lastPositionUTC = ?, lat = ?, lng = ?, speed = ?, directionAngle = ?, gsmSignal = ?, batteryLevel = ?, lastVisibilityUTC = ?;`;
  return mySqlQueryAsync(connectionConfig, sql, params);
};

export { handleUpdateDevice };
