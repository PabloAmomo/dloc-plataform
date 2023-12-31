import { ConnectionConfig } from 'mysql';
import { PersistenceResult } from '../../models/PersistenceResult';
import { mySqlConnectionConfig } from '../functions/mySqlConnectionConfig';
import mySqlQueryAsync from '../functions/mySqlQueryAsync';

const connectionConfig: ConnectionConfig = mySqlConnectionConfig;

const handleUpdateLastActivity = async (imei: string, remoteAddress: string): Promise<PersistenceResult> => {
  const params = [imei];
  const sql = `INSERT INTO device (imei, lastVisibilityUTC) VALUES (?, UTC_TIMESTAMP())
                ON DUPLICATE KEY 
                UPDATE lastVisibilityUTC = UTC_TIMESTAMP();`;
  return mySqlQueryAsync(connectionConfig, sql, params);
};

export { handleUpdateLastActivity };
