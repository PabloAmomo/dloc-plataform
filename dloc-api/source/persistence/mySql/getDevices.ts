import { ConnectionConfig } from "mysql";
import { PersistenceResult } from "../../models/PersistenceResult";
import mySqlQueryAsync from "./functions/mySqlQueryAsync";
import { mySqlConnectionConfig } from "./functions/mySqlConnectionConfig";

const connectionConfig: ConnectionConfig = mySqlConnectionConfig;

const getDevices = async () : Promise<PersistenceResult> => { 
  const params: any[] = [];

  const sql = `SELECT * FROM device ORDER BY imei;`;

  /** Execute query */
  const response: PersistenceResult = await mySqlQueryAsync(connectionConfig, sql, params).then((response) => {
    /** Check for errors */
    if (response.error) return { error: response.error, results: [] };
    /** Return results */
    return { results: response?.results ?? [], error: null };
  });

  return response;
};

export { getDevices };
