import { MutableRefObject } from 'react';
import { LatLng } from './LatLng';
import { MapActions } from './MapActions';
import { MapPath } from './MapPath';
import { Device } from './Device';
import { CenterOn } from './CenterOn';

export interface MapProviderInterface {
  zoomChanged: undefined | boolean;
  setZoomChanged: { (zoomChanged: boolean): void };

  mapMoved: undefined | boolean;
  setMapMoved: { (mapMoved: boolean): void };

  centerOn: undefined | CenterOn;
  setCenterOn: { (centerOn: CenterOn | undefined): void };

  myPosition: undefined | LatLng;
  setMyPosition: { (myPosition: LatLng | undefined): void };

  isLoading: boolean;
  setIsLoading: { (isLoading: boolean): void };

  showPath: boolean;
  setShowPath: { (showPath: boolean): void };

  minutes: number;
  setMinutes: { (minutes: number): void };

  showDevices: string[];
  setShowDevices: { (showDevices: string[]): void };

  mapPaths: MapPath[];
  addMapPaths: { (devices: Device[]): void };

  onActions: MutableRefObject<MapActions>;
}
