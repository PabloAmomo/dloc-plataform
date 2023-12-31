import { ConnectionConfig } from 'mysql';
import { mySqlConnectionConfig } from '../functions/mySqlConnectionConfig';
import mySqlQuerySync from '../functions/mySqlQueryAsync';
import { PersistenceResult } from '../../models/PersistenceResult';

const connectionConfig: ConnectionConfig = mySqlConnectionConfig;

const handleAddHistory = async (imei: string, remoteAddress: string, data: string): Promise<PersistenceResult> => {
  const params = [imei, remoteAddress, data];
  const sql = `INSERT INTO history (imei, remoteAddress, data) VALUES (?, ?, ?);`;
  return mySqlQuerySync(connectionConfig, sql, params);
};

export { handleAddHistory };
