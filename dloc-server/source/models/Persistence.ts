import { PersistenceResult } from '../infraestucture/models/PersistenceResult';
import { PositionPacket } from './PositionPacket';

export interface Persistence {
  addDiscarted: AddDiscarted;
  addPosition: AddPosition;
  addBatteryLevel: AddBatteryLevel;
  addHistory: AddHistory;
  updateDevice: UpdateDevice;
  updateLastActivity: UpdateLastActivity;
  getPersistenceName: GetPersistenceName;
  clean: clean;
  health: health;
}

export interface GetPersistenceName {
  (): string;
}
export interface AddDiscarted {
   (imei: string, remoteAddress: string, reason: string, data: string): Promise<PersistenceResult>;
}
export interface AddPosition {
  (locationPacket: PositionPacket):  Promise<PersistenceResult>;
}
export interface AddBatteryLevel {
  (imei: string, remoteAddress: string, batteryLevel: number):  Promise<PersistenceResult>;
}
export interface AddHistory {
  (imei: string, remoteAddress: string, data: string, response: string):  Promise<PersistenceResult>;
}
export interface UpdateDevice {
  (locationPacket: PositionPacket):  Promise<PersistenceResult>;
}
export interface UpdateLastActivity {
  (imei: string, remoteAddress: string):  Promise<PersistenceResult>;
}
export interface clean {
  ():  Promise<PersistenceResult>;
}
export interface health {
  ():  Promise<PersistenceResult>;
}