import { createLocationPacket } from '../functions/createLocationPacket';
import { PersistenceResult } from '../infraestucture/models/PersistenceResult';
import { getUtcDateTime } from '../functions/getUtcDateTime';
import { HandlePacket } from '../models/HandlePacket';
import { HandlePacketResult } from '../models/HandlePacketResult';
import { PositionPacket } from '../models/PositionPacket';
import { printMessage } from '../functions/printMessage';
import { REGEX_PACKET_NO_WIFI, REGEX_PACKET_WIFI } from '../functions/packetParseREGEX';
import { HandlePacketProps } from '../models/HandlePacketProps';

const handlePacket: HandlePacket = async ({ imei, remoteAdd, data, persistence }: HandlePacketProps): Promise<HandlePacketResult> => {
  const noImei: string = 'no imei received';
  let response: HandlePacketResult = { imei, error: '', response: '' };

  /** Temporal imei (Used only for print messages for user) */
  var imeiTemp: string = imei == '' ? '---------------' : imei;

  /** Common function to discart packet */
  const discardData = (message: string) => {
    response.error = message;
    persistence.addDiscarted(response.imei, remoteAdd, message, data).then((result: PersistenceResult) => {
      if (result.error) printMessage(`[${imeiTemp}] (${remoteAdd}) error persisting discarted [${result.error}]`);
      // TODO: (addDiscarted) Process errors when persisting
    });
  };

  // ---------------------------------------
  // Login Package TRVAP00xxxxIMEIxxxxxxx#
  // ---------------------------------------
  if (data.startsWith('TRVAP00')) {
    response.imei = data.replace('TRVAP00', '').replace('#', '');
    imeiTemp = response.imei == '' ? '---------------' : response.imei;
    response.response = 'TRVBP00' + getUtcDateTime(false) + '#';
    printMessage(`[${imeiTemp}] (${remoteAdd}) imei [${response.imei}]`);
  }

  // ---------------------------------------
  // GPS DATA (14 or REPLY 15)
  // ---------------------------------------
  else if (data.startsWith('TRVYP14') || data.startsWith('TRVYP15')) {
    let values: string[] = data.match(REGEX_PACKET_WIFI) ?? [];

    if (values == null || (values?.length ?? 0) == 0) {
      printMessage(`[${imeiTemp}] (${remoteAdd}) process data without wifi [${data}]`);
      values = data.match(REGEX_PACKET_NO_WIFI) ?? [];
    }

    /** imei not received */
    if (response.imei == '') {
      discardData(noImei);
      return response;
    }

    /** Create location packet and persist */
    const locationPacket: PositionPacket = createLocationPacket(response.imei, remoteAdd, values);
    persistence.addPosition(locationPacket).then((result: PersistenceResult) => {
      if (result.error) printMessage(`[${imeiTemp}] (${remoteAdd}) error persisting position [${result.error}]`);
      // TODO: (addPosition) Process errors when persisting
    });
    response.response = `TRVZP${data.substring(5, 7)}#`;
  }

  // ---------------------------------------
  // Device heartbeat packet
  // ---------------------------------------
  else if (data.startsWith('TRVYP16')) {
    if (response.imei == '') {
      discardData(noImei);
      return response;
    }
    /** Process Battery level */
    if (data.length >= 18) {
      const batteryLevel: number = parseInt(data.substring(14, 17) ?? '0');
      persistence.addBatteryLevel(response.imei, remoteAdd, batteryLevel).then((result: PersistenceResult) => {
        if (result.error) printMessage(`[${imeiTemp}] (${remoteAdd}) error persisting battery level [${result.error}]`);
        // TODO: (addBatteryLevel) Process errors when persisting
      });
    } else {
      /** Or simple update last activity */
      persistence.updateLastActivity(response.imei, remoteAdd).then((result: PersistenceResult) => {
        if (result.error) printMessage(`[${imeiTemp}] (${remoteAdd}) error updating last activity [${result.error}]`);
        // TODO: (updateLastActivity) Process errors when persisting
      });
    }
    response.response = 'TRVZP16#';
  }

  // ---------------------------------------------
  // IMSI number and ICCID number of the device
  // ---------------------------------------------
  else if (data.startsWith('TRVYP02')) {
    if (response.imei == '') {
      discardData(noImei);
      return response;
    }
    response.response = 'TRVZP02#';
  }

  // ---------------------------------------------
  // UNKNOW but need response (TRVAP Packets)
  // ---------------------------------------------
  else if (data.startsWith('TRVAP14') || data.startsWith('TRVAP89')) {
    if (response.imei == '') {
      discardData(noImei);
      return response;
    }
    response.response = `TRVBP${data.substring(5, 7)}#`;
  }

  // ------------------------------------------------
  // Packets with not response needed
  // ------------------------------------------------
  else if (data.startsWith('TRVAP20') || data.startsWith('TRVAP61')) {
    printMessage(`[${imeiTemp}] (${remoteAdd}) received no response needed -> ${data}`);
  }

  // ------------------------------------------------
  // Response to TRVWP02 config packet (Only Info)
  // ------------------------------------------------
  else if (data.startsWith('TRVXP020000010')) {
    persistence.updateLastActivity(response.imei, remoteAdd).then((result: PersistenceResult) => {
      if (result.error) printMessage(`[${imeiTemp}] (${remoteAdd}) error updating last activity [${result.error}]`);
      // TODO: (addHistory) Process errors when persisting
    });
    printMessage(`[${imeiTemp == '' ? '---------------' : response.imei}] (${remoteAdd}) confirmed TRVWP02 packet received`);
  }

  // ---------------------------------------------
  // Unknow command - Discart packet
  // ---------------------------------------------
  else {
    printMessage(`[${imeiTemp}] (${remoteAdd}) command unknown in data [${data}]`);
    discardData('commad unknown');
    return response;
  }

  /** */
  const message = response.response !== '' ? `response [${response.response}]` : `no response to send for packet [${data}]`;
  printMessage(`[${imeiTemp}] (${remoteAdd}) ${message}`);

  /** Add history (Discarted packets not added) */
  persistence.addHistory(response.imei, remoteAdd, data).then((result: PersistenceResult) => {
    if (result.error) printMessage(`[${imeiTemp}] (${remoteAdd}) error persisting history [${result.error}]`);
    // TODO: (addHistory) Process errors when persisting
  });

  /** Return imei */
  return response;
};

export { handlePacket };
