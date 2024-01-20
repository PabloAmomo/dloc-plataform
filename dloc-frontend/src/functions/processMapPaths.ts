import { Device } from 'models/Device';
import { LatLng } from 'models/LatLng';
import { Location } from 'models/Location';
import { MapPath } from 'models/MapPath';
import { Path } from 'models/Path';
import convertUTCDateToLocalDate from './convertUTCDateToLocalDate';
import getDistanceFromLatLonInMeters from './getDistanceFromLatLonInMeters';
import { config } from 'config/config';

const processMapPaths = (devices: Device[], mapPaths: MapPath[]) => {
  const newMapPaths = [...(mapPaths ?? [])];

  /** Process devices */
  for (let i = 0; i < devices.length; i++) {
    const device: Device = devices[i];
    const locations: Location[] = device.locations.reverse();
    const {
      imei,
      lastPositionUTC,
      lat,
      lng,
      params: { pathColor: color },
    } = device;

    /** Find device index */
    let index = newMapPaths.findIndex((mapPath: MapPath) => mapPath.imei === imei);

    /** Not found - Add the new device */
    if (index === -1) {
      const lastPosistion: LatLng = { lat, lng };
      newMapPaths.push({ imei, lastPositionUTC, path: [], lastPosistion, color, strokeWeight: 3, strokeOpacity: 0.25, distance: 0 });
      index = newMapPaths.length - 1;
    }

    /** Process locations for each device */
    const mapPath = newMapPaths[index];
    for (let i = 0; i < locations.length; i++) {
      const location: Location = locations[i];
      const dateTimeUTCms: number = convertUTCDateToLocalDate(location.dateTimeUTC).getTime();
      const existIndex: number = mapPath.path.findIndex((path) => path.dateTimeUTC === location.dateTimeUTC);
      const lastPosition: LatLng = {
        lat: mapPath?.path?.[mapPath.path.length - 1]?.end?.lat ?? mapPath.lastPosistion.lat,
        lng: mapPath?.path?.[mapPath.path.length - 1]?.end?.lng ?? mapPath.lastPosistion.lng,
      };

      /** Location already exist, go for next */
      if (existIndex !== -1) continue;

      /** Find index where to insert new path */
      let insertInto = mapPath.path.findIndex((path) => dateTimeUTCms < convertUTCDateToLocalDate(path.dateTimeUTC).getTime());

      /** Start and end lat and lng position */
      const start: LatLng = insertInto > 0 ? { lat: mapPath.path[insertInto - 1].end.lat, lng: mapPath.path[insertInto - 1].end.lng } : lastPosition;
      const end: LatLng = { lat: location.lat, lng: location.lng };

      /** Update the start lat and lng in the next path */
      if (insertInto > 0) mapPath.path[insertInto - 1].end = { ...start };

      /** Update the start lat and lng in the next path */
      if (insertInto !== -1) mapPath.path[insertInto].start = { ...end };

      /** Add new path in the correct index */
      if (insertInto === -1) mapPath.path.push({ start, end, dateTimeUTC: location.dateTimeUTC });
      else mapPath.path.splice(insertInto, 0, { start, end, dateTimeUTC: location.dateTimeUTC });

      /** Calculate distance in meter bettween start and end lat and lng position */
      const distance = getDistanceFromLatLonInMeters(start.lat, start.lng, end.lat, end.lng);
      mapPath.distance += distance;
    }

    if (mapPath.path.length > 0) {
      /** Update first path */
      mapPath.path[0].start = { ...mapPath.path[0].end };
      /** Update last path */
      const lastPath: Path = mapPath.path[mapPath.path.length - 1];
      lastPath.end = { ...lastPath.start };
      mapPath.lastPosistion = { ...lastPath.end };
      mapPath.lastPositionUTC = lastPath.dateTimeUTC;
    }

    /** Max path length, remove execces paths */
    while (mapPath.path.length > config.map.maxPathsByDevice) {
      const removed: Path | undefined = mapPath.path.shift();
      if (removed) mapPath.distance -= getDistanceFromLatLonInMeters(removed.start.lat, removed.start.lng, removed.end.lat, removed.end.lng);
    }
  }

  /** Return new mapPaths */
  return newMapPaths;
};

export default processMapPaths;
