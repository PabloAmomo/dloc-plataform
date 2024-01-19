import { ConnectionConfig } from 'mysql';
import mySqlQueryAsync from './functions/mySqlQueryAsync';
import { mySqlConnectionConfig } from './functions/mySqlConnectionConfig';
import { GetDevicesResult } from '../models/GetDevicesResult';

const connectionConfig: ConnectionConfig = mySqlConnectionConfig;

const getDevices = async (): Promise<GetDevicesResult> => {
  const params: any[] = [];

  const sql = `SELECT imei, lat, lng, speed, directionAngle, gsmSignal, batteryLevel, lastPositionUTC, lastVisibilityUTC, params 
                FROM device ORDER BY imei;`;

  /** Execute query */
  const response: GetDevicesResult = await mySqlQueryAsync(connectionConfig, sql, params).then((response) => {
    /** Check for errors */
    if (response.error) return { error: response.error, results: [] };
    /** Return results */
    return { results: response?.results ?? [], error: null };
  });

  /** Get positions for each device */
  for (let index = 0; index < response.results.length; index++) {
    const element = response.results[index];

    const paramsPositions: any[] = [element.imei];
    const sqlPositions = `SELECT dateTimeUTC, lat, lng, speed, directionAngle, gsmSignal, batteryLevel 
                          FROM \`position\` WHERE imei = ? ORDER BY dateTimeUTC DESC LIMIT 50;`;

    await mySqlQueryAsync(connectionConfig, sqlPositions, paramsPositions).then((response) => {
      /** Check for errors */
      if (response.error) return { error: response.error, results: [] };
      /** Return results */
      element.positions = response?.results ?? [];
    });
  }

  return response;
};

export { getDevices };
