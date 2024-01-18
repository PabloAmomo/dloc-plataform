import { Device } from 'models/Device';
import { LatLng } from 'models/LatLng';
import { MapPath } from 'models/MapPath';
import getDistanceFromLatLonInMeters from './getDistanceFromLatLonInMeters';

const lineOptions = { strokeWeight: 3, strokeOpacity: 0.25 };
const simulation = true;

const processMapPaths = (devices: Device[], mapPaths: MapPath[]) => {
  const newMapPaths = [...(mapPaths ?? [])];
  /** */
  for (let i = 0; i < devices.length; i++) {
    const device = devices[i];

    /** Find device */
    const index = newMapPaths.findIndex((mapPath: MapPath) => mapPath.imei === device.imei);

    /** Not found - Add new device */
    if (index === -1) {
      newMapPaths.push({
        imei: device.imei,
        path: [],
        lastPosistion: { lat: device.lat, lng: device.lng },
        color: device.params.pathColor,
        ...lineOptions,
        distance: 0,
      });
      continue;
    }

    /** Same position, exit */
    if (!simulation && newMapPaths[index].lastPosistion.lat === device.lat && newMapPaths[index].lastPosistion.lng === device.lng) continue;

    /** Calculate start and end */
    const start: LatLng = newMapPaths[index].lastPosistion;
    const end: LatLng = !simulation
      ? { lat: device.lat, lng: device.lng }
      : { lat: newMapPaths[index].lastPosistion.lat + 0.001, lng: newMapPaths[index].lastPosistion.lng + 0.001 };

    // Calculate distance n meter bettween start and end lat and lng position
    const distance = getDistanceFromLatLonInMeters(start.lat, start.lng, end.lat, end.lng);

    /** Update path */
    newMapPaths[index].distance += distance;
    newMapPaths[index].path.push([start, end]);
    newMapPaths[index].lastPosistion = end;
  }
  /** Return new mapPaths */
  return newMapPaths;
};

export default processMapPaths;
