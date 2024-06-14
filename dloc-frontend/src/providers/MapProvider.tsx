import { CenterMapOn } from 'models/CenterMapOn';
import { CenterMapOnType } from 'enums/CenterMapOnType';
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { Device } from 'models/Device';
import { filterDevices } from 'functions/filterDevices';
import { LatLng } from 'models/LatLng';
import { LatLngArray } from 'models/LatLngArray';
import { logError } from 'functions/logError';
import { Map } from 'leaflet';
import { MapPath } from 'models/MapPath';
import { MapProviderInterface } from 'models/MapProviderInterface';
import { processMapPaths } from 'functions/processMapPaths';
import { useDevicesContext } from './DevicesProvider';
import { userSettingsGet, userSettingsSet } from 'functions/userSettings';
import { useUserContext } from './UserProvider';

export function MapProvider({ children }: { children: any }) {
  const [bounds, setBounds] = useState<LatLngArray[]>();
  const [centerMapOn, setCenterMapOn] = useState<CenterMapOn>({ type: CenterMapOnType.none });
  const [isGettingData, setIsGettingData] = useState<boolean>(false);
  const [map, setMap] = useState<Map>();
  const [mapMoved, setMapMoved] = useState<boolean | undefined>();
  const [minutes, setMinutes] = useState<number>(0);
  const [myPosition, setMyPosition] = useState<LatLng | undefined | null>();
  const [settingsReady, setSettingsReady] = useState<boolean>(false);
  const [showDevices, setShowDevices] = useState<string[]>(['0']);
  const [showPath, setShowPath] = useState<boolean>(false);
  const [visiblePaths, setVisiblePaths] = useState<MapPath[]>([]);
  const isUserAction = useRef<boolean>(false);
  const runOnce = useRef<boolean>(true);
  const { devices } = useDevicesContext();
  const { user, isLoggedIn } = useUserContext();

  /** Check if the map was moved */
  useEffect(() => {
    if (mapMoved && centerMapOn.type !== CenterMapOnType.none) setCenterMapOn({ type: CenterMapOnType.none });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapMoved]);

  /** Calculate the MapPaths to show */
  useEffect(() => {
    /** If there are no devices or the paths are not visible, return */
    if (!showDevices || !devices) return;

    /** If devices to show have device that does not exist, in devices, remove it */
    if (!showDevices.includes('0')) {
      let resetShowDevices: boolean = false;
      showDevices.forEach((imei: string) => {
        if (!resetShowDevices && imei !== '0' && !devices.find((d: Device) => d.imei === imei)) resetShowDevices = true;
      });
      if (resetShowDevices) {
        setShowDevices(['0']);
        return;
      }
    }

    /** If showPath is false, clear the visible paths and exist */
    if (!showPath) {
      if (visiblePaths.length > 0) setVisiblePaths([]);
      return;
    }

    const showingDevices = [...filterDevices(devices, showDevices)];

    /** Create the visible paths */
    let workVisiblePaths: MapPath[] = JSON.parse(JSON.stringify(visiblePaths));

    /** Reaplaced data with data in device params (To detect and refresh configuration changes) */
    workVisiblePaths = workVisiblePaths.map((path: MapPath): MapPath => {
      const device = devices.find((device: Device) => device.imei === path.imei);
      if (!device) return path;
      const { params } = device;
      const { pathColor, startTrack, endTrack } = params;
      return { ...path, color: pathColor, iconTrackStart: startTrack, iconTrackEnd: endTrack };
    });

    /** Process the paths */
    const newVisiblePaths: MapPath[] = processMapPaths(showingDevices ?? [], workVisiblePaths, minutes);

    /** If the paths are the same, return */
    if (JSON.stringify(visiblePaths) === JSON.stringify(newVisiblePaths)) return;

    /** Set the new paths */
    setVisiblePaths(newVisiblePaths);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [devices, showDevices, showPath, minutes]);

  /** Load settings */
  useEffect(() => {
    if (!isLoggedIn) return;

    /** Get the settings */
    const setting = userSettingsGet(user.profile.id);

    /** Set the settings */
    const { interval: savedMinutes, showDevices: savedShowDevices } = setting.geoMap;
    if (savedMinutes !== minutes) setMinutes(savedMinutes);
    if (JSON.stringify(savedShowDevices) !== JSON.stringify(showDevices)) setShowDevices(savedShowDevices);

    /** Set the settings ready */
    setSettingsReady(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn]);

  /** Save settings */
  useEffect(() => {
    if (!isLoggedIn || !settingsReady) {
      /** Correct settingsReady when user is not logged in */
      if (settingsReady) setSettingsReady(false);
      runOnce.current = true;
      return;
    }

    /** Get the settings */
    const setting = userSettingsGet(user.profile.id);
    const { interval: savedInterval, showDevices: savedShowDevices } = setting.geoMap;

    /** If the settings are the same, return */
    if (savedInterval === minutes && JSON.stringify(savedShowDevices) === JSON.stringify(showDevices)) return;

    /** Save the settings */
    setting.geoMap.interval = minutes;
    setting.geoMap.showDevices = showDevices;
    userSettingsSet(setting, user.profile.id);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [minutes, showDevices, isLoggedIn, user]);

  /** Set the bounds */
  useEffect(() => {
    if (!centerMapOn) return;

    const newBounds: LatLngArray[] = [];
    const showingDevices = filterDevices(devices, showDevices);
    switch (centerMapOn.type) {
      case CenterMapOnType.all:
        showingDevices.forEach((device: Device) => newBounds.push([device.lat, device.lng]));
        myPosition && newBounds.push([myPosition.lat, myPosition.lng]);
        break;

      case CenterMapOnType.device:
        centerMapOn?.device &&
          showingDevices
            .filter((device: Device) => device.imei === centerMapOn.device?.imei)
            .forEach((device: Device) => newBounds.push([device.lat, device.lng]));
        break;

      case CenterMapOnType.myPosition:
        myPosition && newBounds.push([myPosition.lat, myPosition.lng]);
        break;

      case CenterMapOnType.devices:
        showingDevices.forEach((device: Device) => newBounds.push([device.lat, device.lng]));
        break;

      case CenterMapOnType.none:
        /** Nothing to bound - Exit */
        return;
    }

    /** Move according to the devices movement */
    isUserAction.current = true;
    setBounds(newBounds);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [centerMapOn, showDevices, devices]);

  /** Center map first time */
  useEffect(() => {
    if (!map || !devices || !showDevices || !myPosition || !runOnce.current) return;
    runOnce.current = false;
    isUserAction.current = true;
    if (centerMapOn.type !== CenterMapOnType.all) setCenterMapOn({ type: CenterMapOnType.all });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, devices, showDevices, myPosition]);

  /** Provider */
  return (
    <MapContext.Provider
      value={{
        bounds,
        centerMapOn,
        isGettingData,
        isUserAction,
        map,
        mapMoved,
        minutes,
        myPosition,
        setCenterMapOn,
        setIsGettingData,
        setMap,
        setMapMoved,
        setMinutes,
        setMyPosition,
        setShowDevices,
        setShowPath,
        showDevices,
        showPath,
        visiblePaths,
      }}
    >
      {children}
    </MapContext.Provider>
  );
}

export const useMapContext = () => useContext(MapContext);

const MapContext = createContext<MapProviderInterface>({
  bounds: undefined,
  centerMapOn: { type: CenterMapOnType.none },
  isGettingData: true,
  isUserAction: { current: false },
  map: undefined,
  mapMoved: undefined,
  minutes: 0,
  myPosition: undefined,
  setCenterMapOn: () => logError('MapContext.setCenterMapOn'),
  setIsGettingData: () => logError('MapContext.setIsGettingData'),
  setMap: () => logError('MapContext.setMap'),
  setMapMoved: () => logError('MapContext.setMapMoved'),
  setMinutes: () => logError('MapContext.setMinutes'),
  setMyPosition: () => logError('MapContext.setMyPosition'),
  setShowDevices: () => logError('MapContext.setShowDevices'),
  setShowPath: () => logError('MapContext.setShowPath'),
  showDevices: [],
  showPath: false,
  visiblePaths: [],
});
