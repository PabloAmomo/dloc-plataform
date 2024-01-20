import { Device } from 'models/Device';
import { LatLng } from 'models/LatLng';
import { Location } from 'models/Location';
import { MapPath } from 'models/MapPath';
import { Path } from 'models/Path';
import convertUTCDateToLocalDate from './convertUTCDateToLocalDate';
import getDistanceFromLatLonInMeters from './getDistanceFromLatLonInMeters';

const maxPathLength = 250;

const processMapPaths = (devices: Device[], mapPaths: MapPath[]) => {
  const newMapPaths = [...(mapPaths ?? [])];

  /** Process devices */
  for (let i = 0; i < devices.length; i++) {
    const device: Device = devices[i];
    const locations: Location[] = device.locations;
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
    locations.forEach((location: Location) => {
      const dateTimeUTCms: number = convertUTCDateToLocalDate(location.dateTimeUTC).getTime();
      const existIndex: number = mapPath.path.findIndex((path) => path.dateTimeUTC === location.dateTimeUTC);

      if (existIndex === -1) {
        /** Find index where to insert new path */
        let insertInto = mapPath.path.findIndex((path) => dateTimeUTCms > convertUTCDateToLocalDate(path.dateTimeUTC).getTime());

        /** Start and end lat and lng position */
        const beforeIdx = insertInto - 1;
        const start: LatLng = beforeIdx >= 0 ? { lat: mapPath.path[beforeIdx].end.lat, lng: mapPath.path[beforeIdx].end.lng } : mapPath.lastPosistion;
        const end: LatLng = { lat: location.lat, lng: location.lng };

        /** Update the start lat and lng in the next path */
        if (existIndex !== -1) mapPath.path[existIndex].start = end;

        /** Add new path in the correct index */
        if (insertInto === -1) mapPath.path.push({ start, end, dateTimeUTC: location.dateTimeUTC });
        else mapPath.path.splice(insertInto, 0, { start, end, dateTimeUTC: location.dateTimeUTC });

        /**  Update last position if date is greater than last position date */
        if (dateTimeUTCms > convertUTCDateToLocalDate(mapPath.lastPositionUTC).getTime()) {
          mapPath.lastPosistion = end;
          mapPath.lastPositionUTC = location.dateTimeUTC;
        }

        /** Calculate distance in meter bettween start and end lat and lng position */
        const distance = getDistanceFromLatLonInMeters(start.lat, start.lng, end.lat, end.lng);
        mapPath.distance += distance;
      }
    });

    /** Max path length, remove execces paths */
    while (mapPath.path.length > maxPathLength) {
      const removed: Path | undefined = mapPath.path.shift();
      if (removed) mapPath.distance -= getDistanceFromLatLonInMeters(removed.start.lat, removed.start.lng, removed.end.lat, removed.end.lng);
    }
  }

  /** Return new mapPaths */
  return newMapPaths;
};

export default processMapPaths;
