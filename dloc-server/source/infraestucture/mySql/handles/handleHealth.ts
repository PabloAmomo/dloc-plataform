import { ConnectionConfig } from 'mysql';
import { mySqlConnectionConfig } from '../functions/mySqlConnectionConfig';
import mySqlQuerySync from '../functions/mySqlQueryAsync';
import { PersistenceResult } from '../../models/PersistenceResult';
import { printMessage } from '../../../functions/printMessage';

const connectionConfig: ConnectionConfig = mySqlConnectionConfig;

const handleHealth = async (): Promise<PersistenceResult> => {
  /** Arbitrary query */
  return mySqlQuerySync(connectionConfig, 'SELECT * FROM dloc.device LIMIT 1;', []);
};

export { handleHealth };
