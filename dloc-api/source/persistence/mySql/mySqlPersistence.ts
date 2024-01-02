import { Persistence } from '../../models/Persistence';
import { PersistenceResult } from '../../models/PersistenceResult';
import { GetDeviceResult } from '../models/GetDeviceResult';
import { GetDevicesResult } from '../models/GetDevicesResult';
import { GetPositionsResult } from '../models/GetPositionsResult';
import { getDevice } from './getDevice';
import { getDevices } from './getDevices';
import { getHealth } from './getHealth';
import { getPositions } from './getPositions';

class mySqlPersistence implements Persistence {
  getPersistenceName(): string {
    return 'My SQL Server';
  }

  getDevice(imei: string): Promise<GetDeviceResult> {
    return getDevice(imei);
  }

  getDevices(): Promise<GetDevicesResult> {
    return getDevices();
  }

  getPositions(imei: string, interval: number): Promise<GetPositionsResult> {
    return getPositions(imei, interval);
  }

  health(): Promise<PersistenceResult> {
    return getHealth();
  }
}

export { mySqlPersistence };
