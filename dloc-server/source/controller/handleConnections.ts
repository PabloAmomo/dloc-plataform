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
  var newConnection: boolean = true;

  /** New socket connection */
  printMessage(`[---------------] (${remoteAdd}) new connection.`);

  /** Create event listeners for socket connection */
  conn.once('close', () => handleClose(remoteAdd));
  conn.on('end', () => handleEnd(remoteAdd));
  conn.on('error', (err: Error) => handleError(remoteAdd, err));

  /** Handle data */
  conn.on('data', (data: any) => {
    const tempImei: string = imei !== '' ? imei : '---------------';
    try {
      /** Process data */
      const dataString: string = data.toString();
      handleData({ imei, remoteAdd, data: dataString, handlePacket, persistence, conn })
        .then((results) => {
          imei = results[0].imei;

          /** Save response to send */
          let toSend: string = '';
          for (let i = 0; i < results.length; i++) {
            if (results[i].response !== '') toSend += results[i].response;
          }

          /** If new connection send configuration after response */
          if (newConnection) {
            toSend += 'TRVWP020000010020#';
            toSend += 'TRVBP20#';
            newConnection = false;
          }

          /** send TRVBP20# every minute (Force to report Position) */
          if (Date.now() - lastTime > 60000) {
            lastTime = Date.now();
            toSend += 'TRVBP20#';
            printMessage(`[${tempImei}] (${remoteAdd}) send command TRVBP20.`);
          }

          /** Send */
          conn.write(toSend);
        })
        .catch((err: Error) => {
          throw err;
        });
    } catch (err: Error | any) {
      conn.destroy();
      printMessage(`[${tempImei}] (${remoteAdd}) error handling data (${err?.message ?? 'unknown error'}) data [${data}].`);
    }
  });
};

export { handleConnections };
