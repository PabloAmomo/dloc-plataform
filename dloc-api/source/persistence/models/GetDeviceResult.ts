import { Device } from "./Device";

export interface GetDeviceResult {
  results: Device[];
  error: Error | null;  
}