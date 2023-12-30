import { ConnectionConfig } from "mysql";
import { DatabaseResult } from "../../models/DatabaseResult";
import { mySqlConnectionConfig } from "../functions/mySqlConnectionConfig";
import mySqlQueryAsync from "../functions/mySqlQueryAsync";

const connectionConfig: ConnectionConfig = mySqlConnectionConfig;

const handleUpdateLastActivity = async (imei: string, remoteAddress: string): Promise<DatabaseResult> => {
  const params = [
    imei
  ];
  const sql = `REPLACE INTO device (imei, lastVisibilityUTC) VALUES (?, UTC_TIMESTAMP());`;
  return mySqlQueryAsync(connectionConfig, sql, params);
};

export { handleUpdateLastActivity };