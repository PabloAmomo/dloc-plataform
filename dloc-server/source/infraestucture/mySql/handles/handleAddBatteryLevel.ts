import { ConnectionConfig } from 'mysql';
import { mySqlConnectionConfig } from '../functions/mySqlConnectionConfig';
import { PersistenceResult } from '../../models/PersistenceResult';
import mySqlQueryAsync from '../functions/mySqlQueryAsync';

const connectionConfig: ConnectionConfig = mySqlConnectionConfig;

const handleAddBatteryLevel = async (imei: string, remoteAddress: any, batteryLevel: number): Promise<PersistenceResult> => {
  const params = [imei, batteryLevel, batteryLevel];
  const sql = `INSERT INTO device (imei, batteryLevel, lastVisibilityUTC) VALUES (?, ?, UTC_TIMESTAMP())
                ON DUPLICATE KEY 
                UPDATE  batteryLevel = ?, lastVisibilityUTC = UTC_TIMESTAMP();`;
  return mySqlQueryAsync(connectionConfig, sql, params);
};

export { handleAddBatteryLevel };
