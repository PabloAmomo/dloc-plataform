import { ConnectionConfig } from 'mysql';
import mySqlQueryAsync from './functions/mySqlQueryAsync';
import { mySqlConnectionConfig } from './functions/mySqlConnectionConfig';
import { GetDeviceResult } from '../models/GetDeviceResult';

const connectionConfig: ConnectionConfig = mySqlConnectionConfig;

const getDevice = async (imei: string): Promise<GetDeviceResult> => {
  const params: any[] = [imei];

  const sql = `SELECT imei, lat, lng, speed, directionAngle, gsmSignal, batteryLevel, lastPositionUTC, lastVisibilityUTC
               FROM device WHERE imei = ? LIMIT 1;`;

  /** Execute query */
  const response: GetDeviceResult = await mySqlQueryAsync(connectionConfig, sql, params).then((response) => {
    /** Check for errors */
    if (response.error) return { error: response.error, results: [] };
    /** Return results */
    return { results: response?.results ?? [], error: null };
  });
  return response;
};

export { getDevice };
