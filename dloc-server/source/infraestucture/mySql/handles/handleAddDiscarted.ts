import { ConnectionConfig } from 'mysql';
import { mySqlConnectionConfig } from '../functions/mySqlConnectionConfig';
import mySqlQueryAsync from '../functions/mySqlQueryAsync';
import { PersistenceResult } from '../../models/PersistenceResult';

const connectionConfig: ConnectionConfig = mySqlConnectionConfig;

const handleAddDiscarted = async (imei: string, remoteAddress: string, reason: string, data: any): Promise<PersistenceResult> => {
  const params = [imei, remoteAddress, data, reason];
  const sql = `INSERT INTO discarted (imei, remoteAddress, data, reason) VALUES (?, ?, ?, ?);`;
  return mySqlQueryAsync(connectionConfig, sql, params);
};

export { handleAddDiscarted };
