import { ConnectionConfig } from "mysql";
import mySqlQueryAsync from "./functions/mySqlQueryAsync";
import { mySqlConnectionConfig } from "./functions/mySqlConnectionConfig";
import { GetDevicesResult } from "../models/GetDevicesResult";

const connectionConfig: ConnectionConfig = mySqlConnectionConfig;

const getDevices = async () : Promise<GetDevicesResult> => { 
  const params: any[] = [];

  const sql = `SELECT * FROM device ORDER BY imei;`;

  /** Execute query */
  const response: GetDevicesResult = await mySqlQueryAsync(connectionConfig, sql, params).then((response) => {
    /** Check for errors */
    if (response.error) return { error: response.error, results: [] };
    /** Return results */
    return { results: response?.results ?? [], error: null };
  });

  return response;
};

export { getDevices };
