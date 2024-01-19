import { LatLng } from "./LatLng";
import { Path } from "./Path";

export type MapPath = {
  imei: string;
  color: string;
  strokeWeight: number;
  strokeOpacity: number;
  path: Path[];
  lastPosistion: LatLng;
  lastPositionUTC: string;
  distance: number;
};