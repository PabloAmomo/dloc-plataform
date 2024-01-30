import { ConnectionConfig } from 'mysql';
import mySqlQueryAsync from './functions/mySqlQueryAsync';
import { mySqlConnectionConfig } from './functions/mySqlConnectionConfig';
import { GetDevicesResult } from '../models/GetDevicesResult';
import { elimintateDuplicates } from '../../functions/eliminateDuplicates';

const connectionConfig: ConnectionConfig = mySqlConnectionConfig;

const getDevices = async (interval: number): Promise<GetDevicesResult> => {
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

  /** Get locations for each device */
  for (let index = 0; index < response.results.length; index++) {
    const element = response.results[index];

    const paramsLocations: any[] = [element.imei, interval];
    const sqlLocations = `SELECT dateTimeUTC, lat, lng, speed, directionAngle, gsmSignal, batteryLevel 
                          FROM \`position\` WHERE imei = ? 
                          ${interval > 1 ? 'AND dateTimeUTC >= DATE_ADD(NOW(), INTERVAL -? MINUTE)' : ''}
                          ORDER BY dateTimeUTC DESC
                          ${interval > 1 ? '' : 'LIMIT 1'}
                          ;`;
    await mySqlQueryAsync(connectionConfig, sqlLocations, paramsLocations).then((response) => {
      /** Check for errors */
      if (response.error) return { error: response.error, results: [] };

      /** Eliminate duplicates in lat lng (Intermediates) */
      response.results = elimintateDuplicates(response.results);

      /** Return results */
      element.locations = response?.results ?? [];
    });
  }

  return response;
};

export { getDevices };
