import { Device } from 'models/Device';
import { LatLng } from 'models/LatLng';
import { MapPath } from 'models/MapPath';
import getDistanceFromLatLonInMeters from './getDistanceFromLatLonInMeters';

const lineOptions = { strokeWeight: 3, strokeOpacity: 0.25 };
const maxPathLength = 100;
const simulation = false;

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
        lastPositionUTC: device.lastPositionUTC,
        path: [],
        lastPosistion: { lat: device.lat, lng: device.lng },
        color: device.params.pathColor,
        ...lineOptions,
        distance: 0,
      });
      continue;
    }

    /** On simulation, update lastPositionUTC */
    if (simulation) newMapPaths[index].lastPositionUTC = new Date().toISOString();

    /** Same date time, exit */
    if (newMapPaths[index].lastPositionUTC === device.lastPositionUTC) continue;

    /** Calculate start and end */
    const start: LatLng = newMapPaths[index].lastPosistion;
    const end: LatLng = !simulation
      ? { lat: device.lat, lng: device.lng }
      : { lat: start.lat + 0.001, lng: start.lng + 0.001 };

    // Calculate distance n meter bettween start and end lat and lng position
    const distance = getDistanceFromLatLonInMeters(start.lat, start.lng, end.lat, end.lng);

    /** Update path */
    newMapPaths[index].distance += distance;
    newMapPaths[index].path.push([start, end]);
    newMapPaths[index].lastPosistion = end;

    /** Remove first path if path length is greater than maxPathLength and discount distance */
    if (newMapPaths[index].path.length > maxPathLength) {
      newMapPaths[index].distance -= getDistanceFromLatLonInMeters(
        newMapPaths[index].path[0][0].lat,
        newMapPaths[index].path[0][0].lng,
        newMapPaths[index].path[0][1].lat,
        newMapPaths[index].path[0][1].lng,
      );
      newMapPaths[index].path.shift();
    }
  }
  /** Return new mapPaths */
  return newMapPaths;
};

export default processMapPaths;
