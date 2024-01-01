import { Persistence } from '../../models/Persistence';
import { PersistenceResult } from '../../models/PersistenceResult';
import { getDevice } from './getDevice';
import { getDevices } from './getDevices';
import { getHealth } from './getHealth';
import { getPositions } from './getPositions';
import { getUser } from './getUser';

class mySqlPersistence implements Persistence {
  getPersistenceName(): string {
    return 'My SQL Server';
  }

  getDevice(imei: string): Promise<PersistenceResult> {
    return getDevice(imei);
  }

  getDevices(): Promise<PersistenceResult> {
    return getDevices();
  }

  getPositions(imei: string, interval: number): Promise<PersistenceResult> {
    return getPositions(imei, interval);
  }

  getUser(id: number): Promise<PersistenceResult> {
    return getUser(id);
  }

  health(): Promise<PersistenceResult> {
    return getHealth();
  }
}

export { mySqlPersistence };
