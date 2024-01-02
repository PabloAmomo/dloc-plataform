export interface Device {
  imei: string;
  lat: number;
  lng: number;
  speed: number;
  directionAngle: number;
  gsmSignal: number;
  batteryLevel: number;
  lastPositionUTC: string;
  lastVisibilityUTC: string; 
}