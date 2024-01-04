import { Device } from "./Device";

export interface DevicesProviderInterface {
  setDevices: {
    (devices: any): void;
  };
  getDevices: {
    (): Device[];
  };  
  devices: Device[];
}