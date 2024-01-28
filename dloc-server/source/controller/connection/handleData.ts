import { HandleDataProps } from '../../models/HandleDataProps';
import { HandlePacketResult } from '../../models/HandlePacketResult';
import { printMessage } from '../../functions/printMessage';

const handleData = async ({ imei, remoteAdd, data, handlePacket, persistence, conn }: HandleDataProps): Promise<HandlePacketResult[]> => {
  /** Save results */
  const results: HandlePacketResult[] = [];

  /** broke data into packets (Sometimes more than one packet is received) */
  const inPackets: string[] = (data ?? '').split('#');
  var sended: string = '';

  /** Process each packet */
  for (let i = 0; i < inPackets.length; i++) {
    /** Discart empty packets */
    if (inPackets[i] == '') continue;

    /** Handle packet */
    try {
      await handlePacket({ imei, remoteAdd, data: inPackets[i] + '#', persistence }).then((result: HandlePacketResult) => {
        /** Save result */
        results.push(result);
        /** Error handling packet */
        if (result.error !== '') throw new Error(result.error);
        /** Update imei */
        imei = result.imei;
        /** Save response to send */
        if (result.response !== '' && conn) {
          conn.write(result.response);
          sended += result.response;
        }
      });
    } catch (err: Error | any) {
      const printImei = imei !== '' ? imei : '---------------';
      printMessage(`[${printImei}] (${remoteAdd}) error handling packet (${err?.message ?? 'unknown error'}) packet [${inPackets[i]}]}]`);
      /** Close connection */
      conn && conn.destroy();
    }
  }

  /** Send response */
  if (sended !== '') {
    // printMessage(`[${imei}] (${remoteAdd}) complete response [${sended}]`);
  }

  /** Return results */
  return results;
};

export default handleData;
