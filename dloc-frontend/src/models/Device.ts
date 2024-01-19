import { DeviceLocation } from "./DeviceLocation";
import { DeviceParams } from "./DeviceParams";

export type Device = DeviceLocation & {
  params: DeviceParams,
};
