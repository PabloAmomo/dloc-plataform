import { Device } from "./Device";

export type GetDevicesResult = {
  devices: Device[];
  error: Error | null;
};