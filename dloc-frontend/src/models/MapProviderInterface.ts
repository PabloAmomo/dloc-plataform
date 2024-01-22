import { MutableRefObject } from "react";
import { LatLng } from "./LatLng";
import { MapActions } from "./MapActions";
import { MapPath } from "./MapPath";
import { Device } from "./Device";

export interface MapProviderInterface {
  zoomChanged: undefined | boolean, 
  setZoomChanged: CallableFunction, 
  mapMoved: undefined | boolean, 
  setMapMoved: CallableFunction,
  centerOn: undefined | Device,
  setCenterOn: CallableFunction,
  myPosition: undefined | LatLng,
  setMyPosition: CallableFunction,  
  isLoading: boolean,
  setIsLoading: CallableFunction,
  showPath: boolean,
  setShowPath: CallableFunction,
  minutes: number,
  setMinutes: CallableFunction,
  showDevices: string[],
  setShowDevices: CallableFunction,
  addMapPaths: { (devices: Device[]) : void },
  mapPaths: MapPath[],
  onActions: MutableRefObject<MapActions>,
}