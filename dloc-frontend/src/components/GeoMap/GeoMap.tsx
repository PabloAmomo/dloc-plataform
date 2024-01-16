import { Device } from 'models/Device';
import { GetPositionsResult } from 'models/GetPositionsResult';
import { LatLng } from 'models/LatLng';
import { Location } from 'models/Location';
import { useDevicesContext } from 'context/DevicesProvider';
import { useSnackContext } from 'context/SnackProvider';
import GeoMapBottomMenu from 'components/GeoMapBottomMenu/GeoMapBottomMenu';
import getMyPosition from 'functions/getMyPosition';
import getPositions from 'services/getPositions/getPositions';
import GoogleMap from 'components/GoogleMap/GoogleMap';
import logError from 'functions/logError';
import React, { useEffect, useRef, useState } from 'react';
import ContainerAllScreen from 'components/ContainerAllScreen/ContainerAllScreen';
import ContainerTop from 'components/ContainerTop/ContainerTop';
import { LinearProgress } from '@mui/material';
import { useMapContext } from 'context/MapProvider';
import GeoMapButtons from 'components/GeoMapButtons/GeoMapButtons';

function GeoMap() {
  const { addSnackbar } = useSnackContext();
  const { zoomChanged, mapMoved, setZoomChanged, setMapMoved, setMyPosition, isLoading, setIsLoading, minutes, onActions } = useMapContext();
  const { devices } = useDevicesContext();
  const devicesProvider = useDevicesContext();
  const [tick, setTick] = useState<number>(0);
  const abortAxios = useRef<AbortController>();
  const centerBoundsActive = !(mapMoved ?? false) && !(zoomChanged ?? false);

  const onGetPosition = (position: LatLng | undefined) => setMyPosition(position);

  /** Update all positions */
  useEffect(() => {
    setIsLoading(true);

    /** Update my position */
    getMyPosition(onGetPosition, () => onGetPosition(undefined));

    /** Update devices */
    if (abortAxios.current) abortAxios.current.abort();
    abortAxios.current = new AbortController();
    getPositions(
      { interval: minutes, imei: '*' },
      (response: GetPositionsResult) => {
        try {
          // TODO: Add error handler if response has error...
          if (response?.error) throw new Error(response.error?.message ?? response.error);

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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => setIsLoading(false), [devices]);

  useEffect(() => {
    try {
      getMyPosition(onGetPosition, () => onGetPosition(undefined));
    } catch (error: any) {}
    /** Update positions every 5 seconds */
    const timer = setInterval(() => setTick(Date.now()), 5000);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /** Set automatic bounds  */
  const handleClickCenterBounds = () => {
    resetZommAndMove();
    onActions.current.centerBounds();
  };

  /** Set automatic bounds  */
  const handleCenterMyLocation = () => {
    resetZommAndMove();
    onActions.current.centerMyLocation();
  };

  const resetZommAndMove = () => {
    setZoomChanged(false);
    setMapMoved(false);
  };

  /** Draw the Map */
  return (
    <>
      <ContainerAllScreen>
        {/* Map */}
        <GoogleMap />

        {/* Action Buttons */}
        <GeoMapButtons clickCenterMyLocation={handleCenterMyLocation} clickCenterBounds={handleClickCenterBounds} centerBoundsActive={centerBoundsActive} />

        {/* Linear Loading */}
        <ContainerTop height={isLoading ? 4 : 0}>
          <LinearProgress color="primary" />
        </ContainerTop>
      </ContainerAllScreen>

      <GeoMapBottomMenu hideIntervalSelector hideDevicesSelector={devices.length === 0} />
    </>
  );
}

export default React.memo(GeoMap);
