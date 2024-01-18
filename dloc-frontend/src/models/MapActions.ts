import { Device } from "./Device";

export interface MapActions {
  centerMyLocation: (zoomChangeState: boolean, mapMovedState: boolean) => void;
  centerBounds: (zoomChangeState: boolean, mapMovedState: boolean) => void; 
  clickOnDevice: (device: Device) => void;
  mapReady: () => boolean;
  clickOnMap: (event: any) => void;
  getZoom: () => number;
  setZoom: (zoom: number) => void;
  showPath: (show: boolean) => void;
}