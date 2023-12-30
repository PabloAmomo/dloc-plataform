import { ConnectionConfig } from "mysql";
import { DatabaseResult } from "../../models/DatabaseResult";
import { mySqlConnectionConfig } from "../functions/mySqlConnectionConfig";
import { mySqlFormatDateTime } from "../functions/mySqlFormatDateTime";
import { PositionPacket } from "../../../models/PositionPacket";
import { printMessage } from "../../../functions/printMessage";
import mySqlQueryAsync from "../functions/mySqlQueryAsync";

const connectionConfig: ConnectionConfig = mySqlConnectionConfig;

const handleUpdateDevice = async (positionPacket: PositionPacket): Promise<DatabaseResult> => {
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
  const params = [
    positionPacket.imei,
    mySqlFormatDateTime(positionPacket.dateTimeUtc),
    positionPacket.lat,
    positionPacket.lng,
    positionPacket.speed,
    positionPacket.directionAngle,
    positionPacket.gsmSignal,
    positionPacket.batteryLevel,
    mySqlFormatDateTime(positionPacket.dateTimeUtc)
  ];
  const sql = `
              REPLACE INTO device (imei, lastPositionUTC, lat, lng, speed, directionAngle, gsmSignal, batteryLevel, lastVisibility)
                VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?);  
             `;
  return mySqlQueryAsync(connectionConfig, sql, params);
};

export { handleUpdateDevice };