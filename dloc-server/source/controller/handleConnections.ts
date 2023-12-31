import { handlePacket } from './handlePacket';
import { Persistence } from '../models/Persistence';
import { printMessage } from '../functions/printMessage';
import { remoteAddress } from '../functions/remoteAddress';
import handleClose from './connection/handleClose';
import handleData from './connection/handleData';
import handleEnd from './connection/handleEnd';
import handleError from './connection/handleError';
import net from 'node:net';

const handleConnections = (conn: net.Socket, persistence: Persistence) => {
  const remoteAdd: string = remoteAddress(conn);
  var imei: string = '';
  var lastTime: number = Date.now();

  /** New socket connection */
  printMessage(`[---------------] (${remoteAdd}) new connection.`);

  /** Send upload time */
  conn.write('TRVWP020000010020#');

  /** Send TRVBP20# */
  conn.write('TRVBP20#');

  /** Create event listeners for socket connection */
  conn.once('close', () => handleClose(remoteAdd));
  conn.on('end', () => handleEnd(remoteAdd));
  conn.on('error', (err: Error) => handleError(remoteAdd, err));

  /** Handle data */
  conn.on('data', (data: any) => {
    const tempImei: string = imei !== '' ? imei : '---------------';
    try {
      /** send TRVBP20# every minute (Force to report Position) */
      if (Date.now() - lastTime > 60000) {
        lastTime = Date.now();
        conn.write('TRVBP20#');
        printMessage(`[${tempImei}] (${remoteAdd}) send command TRVBP20.`);
      }

      /** Process data */
      const dataString: string = data.toString();
      handleData({ imei, remoteAdd, data: dataString, handlePacket, persistence, conn }).then((results) => (imei = results[0].imei));
      //
    } catch (err: Error | any) {
      conn.destroy();
      printMessage(`[${tempImei}] (${remoteAdd}) error handling data (${err?.message ?? 'unknown error'}) data [${data}].`);
    }
  });
};

export { handleConnections };
