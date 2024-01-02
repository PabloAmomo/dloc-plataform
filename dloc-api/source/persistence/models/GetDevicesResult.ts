import { Device } from "./Device";

export interface GetDevicesResult {
  results: Device[];
  error: Error | null;  
}