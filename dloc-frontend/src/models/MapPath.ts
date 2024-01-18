import { LatLng } from "./LatLng";

export type MapPath = {
  imei: string;
  color: string;
  strokeWeight: number;
  strokeOpacity: number;
  path: [LatLng, LatLng][];
  lastPosistion: LatLng;
  lastPositionUTC: string;
  distance: number;
};