import { Device } from "./Device";

export interface MapActions {
  centerMyLocation: () => void;
  centerBounds: () => void; 
  clickOnDevice: (device: Device) => void;
  mapReady: () => boolean;
  clickOnMap: (event: any) => void;
  getZoom: () => number;
  setZoom: (zoom: number) => void;
}