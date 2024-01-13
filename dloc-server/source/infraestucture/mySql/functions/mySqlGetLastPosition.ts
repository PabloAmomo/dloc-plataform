import { ConnectionConfig } from 'mysql';
import { PersistenceResult } from '../../models/PersistenceResult';
import { mySqlConnectionConfig } from './mySqlConnectionConfig';
import { PositionPacket } from '../../../models/PositionPacket';
import { printMessage } from '../../../functions/printMessage';
import mySqlQueryAsync from './mySqlQueryAsync';
import { mySqlFormatDateTime } from './mySqlFormatDateTime';
import { getErrorFromPositionPacket } from '../../functions/getErrorFromPositionPacket';

const connectionConfig: ConnectionConfig = mySqlConnectionConfig;

const mySqlGetLastPosition = async (positionPacket: PositionPacket): Promise<PersistenceResult> => {
  /** validate data */
  const { errorMsg, message } = getErrorFromPositionPacket(positionPacket);
  if (errorMsg !== '' || positionPacket.dateTimeUtc == null) {
    printMessage(message);
    return { results: [], error: new Error(errorMsg) };
  }

  /** Add position */
  const params = [
    positionPacket.imei,
    mySqlFormatDateTime(positionPacket.dateTimeUtc),
  ];
  const sql = `SELECT dateTimeUTC FROM  \`position\` WHERE imei = ? and dateTimeUTC > ? LIMIT 1;`;
  return mySqlQueryAsync(connectionConfig, sql, params);
};

export { mySqlGetLastPosition };