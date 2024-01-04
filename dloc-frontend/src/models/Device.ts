import { DeviceParams } from "./DeviceParams";

export type Device = {
  imei: string,
  batteryLevel: number,
  directionAngle: number,
  gsmSignal: number,
  lastPositionUTC: string,
  lastVisibilityUTC: string,
  lat: number,
  lng: number,
  speed: number,
  params: DeviceParams,
};
