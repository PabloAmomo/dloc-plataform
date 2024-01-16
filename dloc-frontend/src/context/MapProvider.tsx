import userSettingsGet from 'functions/userSettingsGet';
import { LatLng } from 'models/LatLng';
import { MapActions } from 'models/MapActions';
import { MapProviderInterface } from 'models/MapProviderInterface';
import { UserSettings } from 'models/UserSettings';
import { createContext, useContext, useRef, useState } from 'react';

const MapContext = createContext<MapProviderInterface>({
  zoomChanged: undefined,
  setZoomChanged: () => {},
  mapMoved: undefined,
  setMapMoved: () => {},
  myPosition: undefined,
  setMyPosition: () => {},  
  isLoading: true,
  setIsLoading: () => {},  
  minutes: 0,
  setMinutes: () => {},
  showDevices: [],
  setShowDevices: () => {},
  onActions: { current: { centerBounds: () => {}, centerMyLocation: () => {} } }
});

export function MapActionsProvider({ children }: { children: any }) {
  const userSettings: UserSettings = userSettingsGet();
  const [zoomChanged, setZoomChanged] = useState<boolean | undefined>();
  const [mapMoved, setMapMoved] = useState<boolean | undefined>();
  const [myPosition, setMyPosition] = useState<LatLng | undefined>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [minutes, setMinutes] = useState<number>(userSettings.geoMap.interval ?? 0);
  const [showDevices, setShowDevices] = useState<string[]>(userSettings.geoMap.showDevices ?? ['0']);
  const onActions = useRef<MapActions>({ centerBounds: () => {}, centerMyLocation: () => {} });

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
        minutes,
        setMinutes,
        showDevices,
        setShowDevices,
        onActions
      }}
    >
      {children}
    </MapContext.Provider>
  );
}

export const useMapContext = () => useContext(MapContext);
