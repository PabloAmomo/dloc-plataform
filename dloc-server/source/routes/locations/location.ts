import { printMessage } from '../../functions/printMessage';
import { PersistenceResult } from '../../infraestucture/models/PersistenceResult';
import { Persistence } from '../../models/Persistence';
import { PositionPacket } from '../../models/PositionPacket';

const location = async (persistence: Persistence, positionPacket: PositionPacket) => {
  const { imei, remoteAddress } = positionPacket;
  var message: String = 'ok';

  await persistence.addPosition(positionPacket).then((result: PersistenceResult) => {
    if (result.error) {
      message = result.error.message;
      printMessage(`[${imei}] (${remoteAddress}) error persisting position (addPosition) [${result.error}]`);
    }
  });

  await persistence.updateDevice(positionPacket).then((result: PersistenceResult) => {
    if (result.error) {
      message = result.error.message;
      printMessage(`[${imei}] (${remoteAddress}) error persisting position (updateDevice) [${result.error}]`);
    }
  });

  /** Update last activity */
  await persistence.updateLastActivity(imei, remoteAddress).then((result: PersistenceResult) => {
    if (result.error) {
      message = result.error.message;
      printMessage(`[${imei}] (${remoteAddress}) error updating last activity (updateLastActivity) [${result.error}]`);
    }
    // TODO: (updateLastActivity) Process errors when persisting
  });

  /** Add history */
  await persistence.addHistory(imei, remoteAddress, JSON.stringify(positionPacket), '').then((result: PersistenceResult) => {
    if (result.error) {
      console.log('5');
      message = result.error.message;
      printMessage(`[${imei}] (${remoteAddress}) error persisting history (addHistory) [${result.error}]`);
    }
    // TODO: (addHistory) Process errors when persisting
  });

  /** */
  return { code: message === 'ok' ? 200 : 500, result: { message } };
};

export { location };
