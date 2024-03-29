import { Device } from "./Device";

export interface DevicesProviderInterface {
  setDevices: { (devices: any): void; };
  devices: Device[];
  lastUpdate: undefined | Date,
  setLastUpdate: CallableFunction,
}