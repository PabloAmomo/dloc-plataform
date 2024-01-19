import { Device } from 'models/Device';
import { LatLng } from 'models/LatLng';
import { MapPath } from 'models/MapPath';
import getDistanceFromLatLonInMeters from './getDistanceFromLatLonInMeters';
import { Location } from 'models/Location';
import convertUTCDateToLocalDate from './convertUTCDateToLocalDate';

const lineOptions = { strokeWeight: 3, strokeOpacity: 0.25 };
const maxPathLength = 250;

const processMapPaths = (devices: Device[], mapPaths: MapPath[]) => {
  const newMapPaths = [...(mapPaths ?? [])];

  /** Process devices */
  for (let i = 0; i < devices.length; i++) {
    const device: Device = devices[i];
    const locations: Location[] = device.locations;

    /** Find device */
    let index = newMapPaths.findIndex((mapPath: MapPath) => mapPath.imei === device.imei);

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
      index = newMapPaths.length - 1;
    }

    /** Process locations */
    let lastLocation: Location | null = null;
    locations.forEach((location: Location) => {
      const existIndex = newMapPaths[index].path.findIndex((path) => path.dateTimeUTC === location.dateTimeUTC);

      if (existIndex === -1) {
        const date: Date = convertUTCDateToLocalDate(location.dateTimeUTC);
        const start: LatLng = lastLocation ? { lat: lastLocation.lat, lng: lastLocation.lng } : { lat: location.lat, lng: location.lng };
        const end: LatLng = { lat: location.lat, lng: location.lng };

        /** Add new path */
        newMapPaths[index].path.push({ start, end, dateTimeUTC: location.dateTimeUTC });

        /**  Update last position if date is greater than last position date */
        if (!lastLocation || date.getTime() > convertUTCDateToLocalDate(lastLocation.dateTimeUTC).getTime()) {
          newMapPaths[index].lastPosistion = end;
          newMapPaths[index].lastPositionUTC = location.dateTimeUTC;
        }

        /** Calculate distance n meter bettween start and end lat and lng position */
        const distance = getDistanceFromLatLonInMeters(start.lat, start.lng, end.lat, end.lng);
        newMapPaths[index].distance += distance;

        /** Save last */
        lastLocation = location;
      }
    });

    /** Max path length, remove paths */
    while (newMapPaths[index].path.length > maxPathLength) {
      newMapPaths[index].distance -= getDistanceFromLatLonInMeters(
        newMapPaths[index].path[0].start.lat,
        newMapPaths[index].path[0].start.lng,
        newMapPaths[index].path[0].end.lat,
        newMapPaths[index].path[0].end.lng
      );
      newMapPaths[index].path.shift();
    }
  }

  /** Return new mapPaths */
  return newMapPaths;
};

export default processMapPaths;
