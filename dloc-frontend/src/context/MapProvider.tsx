import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { Device } from 'models/Device';
import { LatLng } from 'models/LatLng';
import { MapActions } from 'models/MapActions';
import { MapPath } from 'models/MapPath';
import { MapProviderInterface } from 'models/MapProviderInterface';
import { UserSettings } from 'models/UserSettings';
import {userSettingsGet} from 'functions/userSettings';
import getMyPosition from 'functions/getMyPosition';
import processMapPaths from 'functions/processMapPaths';
import { CenterOn } from 'models/CenterOn';

const emptyActions = {
  centerBounds: () => {},
  centerMyLocation: () => {},
  centerOnDevice: () => {},
  clickOnDevice: () => {},
  mapReady: () => false,
  clickOnMap: () => {},
  getZoom: () => 0,
  setZoom: () => {},
  showPath: () => {},
};

const MapContext = createContext<MapProviderInterface>({
  zoomChanged: undefined,
  setZoomChanged: () => {},
  mapMoved: undefined,
  setMapMoved: () => {},
  myPosition: undefined,
  setMyPosition: () => {},
  isLoading: true,
  setIsLoading: () => {},
  showPath: false,
  setShowPath: () => {},
  minutes: 0,
  setMinutes: () => {},
  showDevices: [],
  setShowDevices: () => {},
  addMapPaths: () => {},
  mapPaths: [],
  centerOn: undefined,
  setCenterOn: () => {},
  onActions: { current: emptyActions },
});

export function MapActionsProvider({ children }: { children: any }) {
  const userSettings: UserSettings = userSettingsGet();
  const [zoomChanged, setZoomChanged] = useState<boolean | undefined>();
  const [mapMoved, setMapMoved] = useState<boolean | undefined>();
  const [myPosition, setMyPosition] = useState<LatLng | undefined>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showPath, setShowPath] = useState<boolean>(false);
  const [minutes, setMinutes] = useState<number>(userSettings.geoMap.interval ?? 0);
  const [showDevices, setShowDevices] = useState<string[]>(userSettings.geoMap.showDevices ?? ['0']);
  const [tick, setTick] = useState<number>(0);
  const [mapPaths, setMapPaths] = useState<MapPath[]>([]);
  const [centerOn, setCenterOn] = useState<CenterOn | undefined>();

  const onActions = useRef<MapActions>(emptyActions);

  const addMapPaths = (devices: Device[]) => setMapPaths(processMapPaths(devices, mapPaths, minutes));

  const onGetPosition = (position: LatLng | undefined) => setMyPosition(position);

  /** Update all device positions */
  useEffect(() => {
    getMyPosition(onGetPosition, () => onGetPosition(undefined));
  }, [tick]);

  useEffect(() => {
    /** Update my position */
    setTick(Date.now());
    /** Update my position every 5 seconds */
    const timer = setInterval(() => setTick(Date.now()), 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <MapContext.Provider
      value={{
        zoomChanged,
        setZoomChanged,
        mapMoved,
        setMapMoved,
        myPosition,
        setMyPosition,
        isLoading,
        setIsLoading,
        showPath,
        setShowPath,
        minutes,
        setMinutes,
        showDevices,
        setShowDevices,
        addMapPaths,
        mapPaths,
        centerOn,
        setCenterOn,
        onActions,
      }}
    >
      {children}
    </MapContext.Provider>
  );
}

export const useMapContext = () => useContext(MapContext);
