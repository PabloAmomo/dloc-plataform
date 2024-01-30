import { GetDeviceResult } from '../persistence/models/GetDeviceResult';
import { GetDevicesResult } from '../persistence/models/GetDevicesResult';
import { GetPositionsResult } from '../persistence/models/GetPositionsResult';
import { PersistenceResult } from './PersistenceResult'

export interface Persistence {
  getPersistenceName: GetPersistenceName;
  getDevice: getDevice;
  getDevices: getDevices;
  getPositions: getPositions;
  health: health;
}

export interface GetPersistenceName {
  (): string;
}

export interface getDevice {
   (imei: string): Promise<GetDeviceResult>;
}
export interface getDevices {
  (interval: number): Promise<GetDevicesResult>;
}

export interface getPositions {
  (imei: string, interval: number): Promise<GetPositionsResult>;
}

export interface health {
  ():  Promise<PersistenceResult>;
}