import { Device } from 'models/Device';
import { GetPositionsResult } from 'models/GetPositionsResult';
import { LatLng } from 'models/LatLng';
import { Location } from 'models/Location';
import { useDevicesContext } from 'context/DevicesProvider';
import { UserSettings } from 'models/UserSettings';
import { useSnackContext } from 'context/SnackProvider';
import GeoMapBottomMenu from 'components/GeoMapBottomMenu/GeoMapBottomMenu';
import getMyPosition from 'functions/getMyPosition';
import getPositions from 'services/getPositions/getPositions';
import GoogleMap from 'components/GoogleMap/GoogleMap';
import logError from 'functions/logError';
import React, { useEffect, useRef, useState } from 'react';
import userSettingsGet from 'functions/userSettingsGet';
import ContainerAllScreen from 'components/ContainerAllScreen/ContainerAllScreen';

function GeoMap() {
  const userSettings: UserSettings = userSettingsGet();
  const { addSnackbar } = useSnackContext();
  const { devices } = useDevicesContext();
  const devicesProvider = useDevicesContext();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [myPosition, setMyPosition] = useState<LatLng | null>(null);
  const [minutes, setMinutes] = useState<number>(userSettings.geoMap.interval ?? 0);
  const [showDevices, setShowDevices] = useState<string[]>(userSettings.geoMap.showDevices ?? ['0']);
  const [tick, setTick] = useState<number>(0);
  const abortAxios = useRef<AbortController>();

  const onGetPosition = (position: LatLng | null) => setMyPosition(position);

  /** Update all positions */
  useEffect(() => {
    setIsLoading(true);

    /** Update my position */
    getMyPosition(onGetPosition, () => onGetPosition(null));

    /** Update devices */
    if (abortAxios.current) abortAxios.current.abort();
    abortAxios.current = undefined;

    /** Update devices */
    abortAxios.current = new AbortController();
    getPositions(
      { interval: minutes, imei: '*' },
      (response: GetPositionsResult) => {
        try {
          // TODO: Add error handler if response has error...
          if (response?.error) throw new Error(response.error.message);

          /** Update devices */
          var newDevices: Device[] = devicesProvider.getDevices();
          response.locations.forEach((location: Location) => {
            for (let i = 0; i < newDevices.length; i++) {
              if (newDevices[i].imei === location.imei) {
                const { batteryLevel, directionAngle, gsmSignal, lat, lng, speed, lastPositionUTC, lastVisibilityUTC } = location;
                Object.assign(newDevices[i], { batteryLevel, directionAngle, gsmSignal, lat, lng, speed, lastPositionUTC, lastVisibilityUTC });
                break;
              }
            }
          });

          /** Set new devices */
          devicesProvider.setDevices(newDevices);
        } catch (error: any) {
          addSnackbar && addSnackbar('error', error.message ?? error);
          logError(error.message, error);
        } finally {
          abortAxios.current = undefined;
          setIsLoading(false);
        }
      },
      abortAxios.current
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tick]);

  /** Devices changed */
  useEffect(() => setIsLoading(false), [devices]);

  useEffect(() => {
    getMyPosition(onGetPosition, () => onGetPosition(null));
    /** Update positions every 5 seconds */
    const timer = setInterval(() => setTick(Date.now()), 5000);
    return () => clearInterval(timer);
  }, []);

  /** Draw the Map */
  return (
    <>
      <ContainerAllScreen>
        <GoogleMap isLoading={isLoading} myPosition={myPosition} showDevices={showDevices} />
      </ContainerAllScreen>

      <GeoMapBottomMenu
        hideIntervalSelector
        isLoading={isLoading}
        setMinutes={setMinutes}
        minutes={minutes}
        showDevices={showDevices}
        setShowDevices={setShowDevices}
      />
    </>
  );
}

export default React.memo(GeoMap);
