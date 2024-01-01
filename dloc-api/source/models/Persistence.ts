import { PersistenceResult } from './PersistenceResult'

export interface Persistence {
  getPersistenceName: GetPersistenceName;
  getDevice: getDevice;
  getDevices: getDevices;
  getPositions: getPositions;
  getUser: getUser;
  health: health;
}

export interface GetPersistenceName {
  (): string;
}

export interface getDevice {
   (imei: string): Promise<PersistenceResult>;
}
export interface getDevices {
  (): Promise<PersistenceResult>;
}

export interface getPositions {
  (imei: string, interval: number): Promise<PersistenceResult>;
}

export interface getUser {
  (id: number): Promise<PersistenceResult>;
}

export interface health {
  ():  Promise<PersistenceResult>;
}