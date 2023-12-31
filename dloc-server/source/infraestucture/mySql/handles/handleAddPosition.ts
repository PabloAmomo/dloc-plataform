import { ConnectionConfig } from 'mysql';
import { PersistenceResult } from '../../models/PersistenceResult';
import { mySqlConnectionConfig } from '../functions/mySqlConnectionConfig';
import { PositionPacket } from '../../../models/PositionPacket';
import { printMessage } from '../../../functions/printMessage';
import mySqlQueryAsync from '../functions/mySqlQueryAsync';
import { mySqlFormatDateTime } from '../functions/mySqlFormatDateTime';
import { handleUpdateDevice } from './handleUpdateDevice';
import { getErrorFromPositionPacket } from '../../functions/getErrorFromPositionPacket';

const connectionConfig: ConnectionConfig = mySqlConnectionConfig;

const handleAddPosition = async (positionPacket: PositionPacket): Promise<PersistenceResult> => {
  /** validate data */
  const { errorMsg, message } = getErrorFromPositionPacket(positionPacket);
  if (errorMsg !== '' || positionPacket.dateTimeUtc == null) {
    printMessage(message);
    return { results: [], error: new Error(errorMsg) };
  }

  /** Update device */
  await handleUpdateDevice(positionPacket);

  /** Add position */
  const params = [
    positionPacket.imei,
    positionPacket.remoteAddress,
    mySqlFormatDateTime(positionPacket.dateTimeUtc),
    positionPacket.lat,
    positionPacket.lng,
    positionPacket.speed,
    positionPacket.directionAngle,
    positionPacket.gsmSignal,
    positionPacket.batteryLevel,
  ];
  const sql = `INSERT INTO \`position\` (imei, remoteAddress, dateTimeUTC, lat, lng, speed, directionAngle, gsmSignal, batteryLevel) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`;
  return mySqlQueryAsync(connectionConfig, sql, params);
};

export { handleAddPosition };
