import { ConnectionConfig } from "mysql";
import { PersistenceResult } from "../../models/PersistenceResult";
import { mySqlConnectionConfig } from "./functions/mySqlConnectionConfig";
import mySqlQueryAsync from "./functions/mySqlQueryAsync";

const connectionConfig: ConnectionConfig = mySqlConnectionConfig;

const getHealth = async () : Promise<PersistenceResult> => { 
  const params: any[] = [];

  const sql = `SELECT COUNT(*) FROM device LIMIT 1;`;

  /** Execute query */
  const response: PersistenceResult = await mySqlQueryAsync(connectionConfig, sql, params).then((response) => {
    /** Check for errors */
    if (response.error) return { error: response.error, results: [ { health: 'ko' } ] };
    /** Return results */
    return { results: [ { health: 'ok' } ], error: null };
  });

  return response;
};

export { getHealth };
