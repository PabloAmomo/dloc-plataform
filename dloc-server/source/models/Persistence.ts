import { DatabaseResult } from '../infraestucture/models/DatabaseResult';
import { PositionPacket } from './PositionPacket';

export interface Persistence {
  addDiscarted: AddDiscarted;
  addPosition: AddPosition;
  addBatteryLevel: AddBatteryLevel;
  addHistory: AddHistory;
  updateDevice: UpdateDevice;
  updateLastActivity: UpdateLastActivity;
  getPersistenceName: GetPersistenceName;
}

export interface GetPersistenceName {
  (): string;
}
export interface AddDiscarted {
   (imei: string, remoteAddress: string, reason: string, data: string): Promise<DatabaseResult>;
}
export interface AddPosition {
  (locationPacket: PositionPacket):  Promise<DatabaseResult>;
}
export interface AddBatteryLevel {
  (imei: string, remoteAddress: string, batteryLevel: number):  Promise<DatabaseResult>;
}
export interface AddHistory {
  (imei: string, remoteAddress: string, data: string):  Promise<DatabaseResult>;
}
export interface UpdateDevice {
  (locationPacket: PositionPacket):  Promise<DatabaseResult>;
}
export interface UpdateLastActivity {
  (imei: string, remoteAddress: string):  Promise<DatabaseResult>;
}