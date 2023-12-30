import { ConnectionConfig } from 'mysql';
import { mySqlConnectionConfig } from '../functions/mySqlConnectionConfig';
import { DatabaseResult } from '../../models/DatabaseResult';
import mySqlQueryAsync from '../functions/mySqlQueryAsync';

const connectionConfig: ConnectionConfig = mySqlConnectionConfig;

const handleAddBatteryLevel = async (imei: string, remoteAddress: any, batteryLevel: number): Promise<DatabaseResult> => {
  const params = [
    imei,
    batteryLevel,
  ];
  const sql = `REPLACE INTO device (imei, batteryLevel, lastVisibilityUTC) VALUES (?, ?, UTC_TIMESTAMP());`;
  return mySqlQueryAsync(connectionConfig, sql, params);
};

export { handleAddBatteryLevel };
