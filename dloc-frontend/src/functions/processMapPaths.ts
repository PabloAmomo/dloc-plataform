import { config } from 'config/config';
import { Device } from 'models/Device';
import { LatLng } from 'models/LatLng';
import { Location } from 'models/Location';
import { MapPath } from 'models/MapPath';
import { Path } from 'models/Path';
import convertUTCDateToLocalDate from './convertUTCDateToLocalDate';
import distanceFromLatLngInMeters from './distanceFromLatLngInMeters';

const processMapPaths = (devices: Device[], mapPaths: MapPath[], minutes: number): MapPath[] => {
  const newMapPaths = [...(mapPaths ?? [])];

  /** Remove mapPaths not in devices */
  const imeiList: string[] = devices.map((device: Device) => device.imei);
  for (let i = newMapPaths.length - 1; i >= 0; i--) {
    const mapPath: MapPath = newMapPaths[i];
    if (!imeiList.includes(mapPath.imei)) newMapPaths.splice(i, 1);
  }

  /** Process devices */
  for (let i = 0; i < devices.length; i++) {
    const device: Device = devices[i];
    const locations: Location[] = device.locations.reverse();
    const { imei, lastPositionUTC, lat, lng, params } = device;
    const { pathColor: color } = params;

    /** Find device index and add a new device if not exist, and select it */
    let index = newMapPaths.findIndex((mapPath: MapPath) => mapPath.imei === imei);
    if (index === -1) {
      const lastPosistion: LatLng = { lat, lng };
      newMapPaths.push({ imei, lastPositionUTC, path: [], lastPosistion, color, strokeWeight: 3, strokeOpacity: 0.25, distance: 0 });
      index = newMapPaths.length - 1;
    }
    const mapPath = newMapPaths[index];

    /** Create paths, merging currents paths and new locations */
    const paths: Map<string, Path> = new Map<string, Path>();
    mapPath.path.forEach((path: Path) => paths.set(path.dateTimeUTC, path));
    locations.forEach((location: Location) => {
      const locTemp: LatLng = { lat: location.lat, lng: location.lng };
      const dateTimeUTC: string = location.dateTimeUTC;
      paths.set(dateTimeUTC, { start: { ...locTemp }, end: { ...locTemp }, dateTimeUTC });
    });

    /** Make array of paths and sort by dateTimeUTC */
    let newPaths: Path[] = Array.from(paths, ([name, value]) => value);

    /** Remove paths older than minutes */
    const timeLimit: Date = new Date(new Date().getTime() - minutes * 60 * 1000);
    newPaths = newPaths.filter((path: Path) => convertUTCDateToLocalDate(path.dateTimeUTC) > timeLimit);

    /** Make array of paths and sort by dateTimeUTC */
    newPaths.sort((a: Path, b: Path) => convertUTCDateToLocalDate(a.dateTimeUTC).getTime() - convertUTCDateToLocalDate(b.dateTimeUTC).getTime());

    /** Correct paths to start and end correctly */
    mapPath.distance = 0;
    newPaths.forEach((path: Path, index: number) => {
      if (index === 0) path.start = { ...path.end };
      else {
        const prevPath: Path = newPaths[index - 1];
        prevPath.end = { ...path.start };
      }
    });

    /** remove path point (Same start to end) */
    for (let i = newPaths.length - 2; i > 0; i--) {
      if (newPaths[i].start.lat === newPaths[i].end.lat && newPaths[i].start.lng === newPaths[i].end.lng) newPaths.splice(i, 1);
    }

    /** Max path length, remove execces paths */
    while (newPaths.length > config.map.maxPathsByDevice) {
      newPaths.shift();
    }

    /** Calculate distance */
    newPaths.forEach((path: Path) => {
      mapPath.distance += distanceFromLatLngInMeters(path.start.lat, path.start.lng, path.end.lat, path.end.lng);
    });

    /** Update las time */
    if (mapPath.path.length > 0) mapPath.lastPositionUTC = mapPath.path[mapPath.path.length - 1].dateTimeUTC;

    /** Update paths */
    mapPath.path = newPaths;
  }

  /** Return new mapPaths */
  return newMapPaths;
};

export default processMapPaths;
