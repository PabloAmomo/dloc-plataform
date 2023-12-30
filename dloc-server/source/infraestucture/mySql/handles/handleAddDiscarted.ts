import { ConnectionConfig } from 'mysql';
import { mySqlConnectionConfig } from '../functions/mySqlConnectionConfig';
import mySqlQueryAsync from '../functions/mySqlQueryAsync';
import { DatabaseResult } from '../../models/DatabaseResult';

const connectionConfig: ConnectionConfig = mySqlConnectionConfig;

const handleAddDiscarted = async (imei: string, remoteAddress: string, reason: string, data: any): Promise<DatabaseResult> => {
  const params = [imei, remoteAddress, data, reason];
  const sql = `INSERT INTO discarted (imei, remoteAddress, data, reason) VALUES (?, ?, ?, ?);`;
  return mySqlQueryAsync(connectionConfig, sql, params);
};

export { handleAddDiscarted };
