import { ConnectionConfig } from 'mysql';
import { mySqlConnectionConfig } from '../functions/mySqlConnectionConfig';
import mySqlQueryAsync from '../functions/mySqlQueryAsync';
import { PersistenceResult } from '../../models/PersistenceResult';

const connectionConfig: ConnectionConfig = mySqlConnectionConfig;

const handleAddDiscarted = async (imei: string, remoteAddress: string, reason: string, data: any): Promise<PersistenceResult> => {
  const params = [imei, remoteAddress, reason, data];
  const sql = `INSERT INTO discarted (imei, remoteAddress, reason, data) VALUES (?, ?, ?, ?);`;
  return mySqlQueryAsync(connectionConfig, sql, params);
};

export { handleAddDiscarted };
