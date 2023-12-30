import { PositionPacket } from '../../models/PositionPacket';
import { Persistence, UpdateLastActivity } from '../../models/Persistence';
import { DatabaseResult } from '../models/DatabaseResult';
import * as wrapper from './handles/handleWrapper';

class mySqlPersistence implements Persistence {
  getPersistenceName(): string {  
    return 'My SQL Server';
  }

  addDiscarted(imei: string, remoteAddress: string, message: string, data: string): Promise<DatabaseResult> {
    return wrapper.handleAddDiscarted(imei, remoteAddress, message, data);
  }
  addPosition(locationPacket: PositionPacket):  Promise<DatabaseResult> {
    return wrapper.handleAddPosition(locationPacket);
  }
  addBatteryLevel(imei: string, remoteAddress: string, batteryLevel: number):  Promise<DatabaseResult> {
    return wrapper.handleAddBatteryLevel(imei, remoteAddress, batteryLevel);
  }
  addHistory(imei: string, remoteAddress: string, data: string):  Promise<DatabaseResult> {
    return wrapper.handleAddHistory(imei, remoteAddress, data);
  }
  updateDevice(locationPacket: PositionPacket):  Promise<DatabaseResult> {
    return wrapper.handleUpdateDevice(locationPacket);
  }
  updateLastActivity(imei: string, remoteAddress: string):  Promise<DatabaseResult> {
    return wrapper.handleUpdateLastActivity(imei, remoteAddress);
  }
}

export { mySqlPersistence };
