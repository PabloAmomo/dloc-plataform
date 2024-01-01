import { ConnectionConfig } from "mysql";
import { PersistenceResult } from "../../models/PersistenceResult";
import { mySqlConnectionConfig } from "./functions/mySqlConnectionConfig";
import mySqlQueryAsync from "./functions/mySqlQueryAsync";

const connectionConfig: ConnectionConfig = mySqlConnectionConfig;

const getPositions = async (imei: string, interval: number) : Promise<PersistenceResult> => { 
  const params: any[] = [imei];

  const sql = `SELECT dateTimeUTC, lat, lng, speed, directionAngle, gsmSignal, batteryLevel
               FROM \`position\` WHERE imei = ? ORDER BY dateTimeUTC DESC, id DESC LIMIT 50;`;
               
  /** Execute query */
  const response: PersistenceResult = await mySqlQueryAsync(connectionConfig, sql, params).then((response) => {
    /** Check for errors */
    if (response.error) return { error: response.error, results: [] };
    /** Return results */
    return { results: response?.results ?? [], error: null };
  });

  return response;
};

export { getPositions };
