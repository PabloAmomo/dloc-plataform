import { ConnectionConfig } from 'mysql';
import { PersistenceResult } from '../../models/PersistenceResult';
import mySqlQueryAsync from './functions/mySqlQueryAsync';
import { mySqlConnectionConfig } from './functions/mySqlConnectionConfig';

const connectionConfig: ConnectionConfig = mySqlConnectionConfig;

const getDevice = async (imei: string): Promise<PersistenceResult> => {
  const params: any[] = [imei];

  const sql = `SELECT * FROM device WHERE imei = ? LIMIT 1;`;

  /** Execute query */
  const response: PersistenceResult = await mySqlQueryAsync(connectionConfig, sql, params).then((response) => {
    /** Check for errors */
    if (response.error) return { error: response.error, results: [] };
    /** Return results */
    return { results: response?.results ?? [], error: null };
  });

  return response;
};

export { getDevice };
