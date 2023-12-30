import { ConnectionConfig } from 'mysql';
import { DatabaseResult } from '../../models/DatabaseResult';
import { mySqlConnectionConfig } from '../functions/mySqlConnectionConfig';
import { PositionPacket } from '../../../models/PositionPacket';
import { printMessage } from '../../../functions/printMessage';
import mySqlQueryAsync from '../functions/mySqlQueryAsync';
import { mySqlFormatDateTime } from '../functions/mySqlFormatDateTime';
import { handleUpdateDevice } from './handleUpdateDevice';

const connectionConfig: ConnectionConfig = mySqlConnectionConfig;

const handleAddPosition = async (positionPacket: PositionPacket): Promise<DatabaseResult> => {
  const imei = positionPacket.imei === '' ? '---------------' : positionPacket.imei;
  if (!positionPacket || !positionPacket.valid || !positionPacket.imei) { 
    printMessage(`[${imei}] (${positionPacket.remoteAddress}) location without valid data [valid ${positionPacket.valid}]`);
    return { results: [], error: new Error('location without valid data') }; 
  }
  if (positionPacket.lat == null || positionPacket.lng == null) { 
    printMessage(`[${imei}] (${positionPacket.remoteAddress}) location without position [lat: ${positionPacket.lat ?? 'ND'} lng: ${positionPacket.lng ?? 'ND'} ]`);
    return { results: [], error: new Error('location without position') }; 
  }
  if (positionPacket.dateTimeUtc == null) { 
    printMessage(`[${imei}] (${positionPacket.remoteAddress}) invalid date time (Is null)`);  
    return { results: [], error: new Error('invalid date time') };
  }

  /** Update device */
  await handleUpdateDevice(positionPacket);

  /** Add position */
  const params = [
    /** position */
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
  const sql = `
              INSERT INTO 
                \`position\` (imei, remoteAddress, dateTimeUTC, lat, lng, speed, directionAngle, gsmSignal, batteryLevel) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);
             `;
  return mySqlQueryAsync(connectionConfig, sql, params);
};

export { handleAddPosition };
