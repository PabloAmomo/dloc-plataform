import { PositionPacket } from '../../models/PositionPacket';
import { Persistence } from '../../models/Persistence';
import { PersistenceResult } from '../models/PersistenceResult';
import * as wrapper from './handles/handleWrapper';

class mySqlPersistence implements Persistence {
  getPersistenceName(): string {  
    return 'My SQL Server';
  }

  addDiscarted(imei: string, remoteAddress: string, message: string, data: string): Promise<PersistenceResult> {
    return wrapper.handleAddDiscarted(imei, remoteAddress, message, data);
  }
  addPosition(locationPacket: PositionPacket):  Promise<PersistenceResult> {
    return wrapper.handleAddPosition(locationPacket);
  }
  addBatteryLevel(imei: string, remoteAddress: string, batteryLevel: number):  Promise<PersistenceResult> {
    return wrapper.handleAddBatteryLevel(imei, remoteAddress, batteryLevel);
  }
  addHistory(imei: string, remoteAddress: string, data: string, response: string):  Promise<PersistenceResult> {
    return wrapper.handleAddHistory(imei, remoteAddress, data, response);
  }
  updateDevice(locationPacket: PositionPacket):  Promise<PersistenceResult> {
    return wrapper.handleUpdateDevice(locationPacket);
  }
  updateLastActivity(imei: string, remoteAddress: string):  Promise<PersistenceResult> {
    return wrapper.handleUpdateLastActivity(imei, remoteAddress);
  }
  clean():  Promise<PersistenceResult> {
    return wrapper.handleClean();
  } 
  health():  Promise<PersistenceResult> {
    return wrapper.handleHealth();
  } 
}

export { mySqlPersistence };
