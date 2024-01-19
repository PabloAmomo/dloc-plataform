import { Location } from "./Location";

export type DeviceLocation = {
  imei: string,
  batteryLevel: number,
  directionAngle: number,
  gsmSignal: number,
  lastPositionUTC: string,
  lastVisibilityUTC: string,
  lat: number,
  lng: number,
  speed: number,
  locations: Location[],
};