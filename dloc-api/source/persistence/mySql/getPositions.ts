import { ConnectionConfig } from "mysql";
import { mySqlConnectionConfig } from "./functions/mySqlConnectionConfig";
import mySqlQueryAsync from "./functions/mySqlQueryAsync";
import { GetPositionsResult } from "../models/GetPositionsResult";

const connectionConfig: ConnectionConfig = mySqlConnectionConfig;

const getPositions = async (imei: string, interval: number) : Promise<GetPositionsResult> => { 
  const params: any[] = [imei, imei, interval ?? 1440];

  const sql = `
                (SELECT dateTimeUTC, lat, lng, speed, directionAngle, gsmSignal, batteryLevel
                  FROM \`position\` WHERE imei = ? ORDER BY dateTimeUTC DESC, id DESC LIMIT 1)
                UNION
                (SELECT dateTimeUTC, lat, lng, speed, directionAngle, gsmSignal, batteryLevel
                    FROM \`position\` WHERE imei = ? AND dateTimeUTC >= DATE_ADD(NOW(), INTERVAL ? SECOND) ORDER BY dateTimeUTC DESC, id DESC);
    `;

  /** Execute query */
  const response: GetPositionsResult = await mySqlQueryAsync(connectionConfig, sql, params).then((response) => {
    /** Check for errors */
    if (response.error) return { error: response.error, results: [] };
    /** Return results */
    return { results: response?.results ?? [], error: null };
  });

  return response;
};

export { getPositions };
