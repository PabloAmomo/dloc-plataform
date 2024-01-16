import { Device } from 'models/Device';
import { GetPositionsResult } from 'models/GetPositionsResult';
import { LatLng } from 'models/LatLng';
import { LinearProgress } from '@mui/material';
import { Location } from 'models/Location';
import { memo, useEffect, useRef, useState } from 'react';
import { useDevicesContext } from 'context/DevicesProvider';
import { useMapContext } from 'context/MapProvider';
import { useSnackContext } from 'context/SnackProvider';
import ContainerAllScreen from 'components/ContainerAllScreen/ContainerAllScreen';
import ContainerTop from 'components/ContainerTop/ContainerTop';
import GeoMapBottomMenu from 'components/GeoMapBottomMenu/GeoMapBottomMenu';
import GeoMapButtons from 'components/GeoMapButtons/GeoMapButtons';
import getMyPosition from 'functions/getMyPosition';
import getPositions from 'services/getPositions/getPositions';
import GoogleMap from 'components/Google/GoogleMap/GoogleMap';
import logError from 'functions/logError';

function GeoMap() {
  const [tick, setTick] = useState<number>(0);
  const { addSnackbar } = useSnackContext();
  const { devices } = useDevicesContext();
  const { zoomChanged, mapMoved, setZoomChanged, setMapMoved, setMyPosition, isLoading, setIsLoading, minutes, onActions } = useMapContext();
  const abortAxios = useRef<AbortController>();
  const centerBoundsActive = !(mapMoved ?? false) && !(zoomChanged ?? false);
  const devicesProvider = useDevicesContext();

  /** Update my position */
  const onGetPosition = (position: LatLng | undefined) => setMyPosition(position);

  /** Update devices */
  const processDevices = (response: GetPositionsResult) => {
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
  };

  /** Update all device positions */
  useEffect(() => {
    setIsLoading(true);

    /** Update my position */
    getMyPosition(onGetPosition, () => onGetPosition(undefined));

    /** Update devices */
    getPositions(
      { interval: minutes, imei: '*' },
      (response: GetPositionsResult) => {
        try {
          // TODO: Add error handler if response has error...
          if (response?.error) throw new Error(response.error?.message ?? response.error);

          processDevices(response);
        } catch (error: any) {
          addSnackbar && addSnackbar('error', error.message ?? error);
          logError(error.message, error);
        } finally {
          setIsLoading(false);
        }
      },
      abortAxios
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

  /** Center on my location  */
  const handleCenterMyLocation = () => {
    resetZommAndMove();
    onActions.current.centerMyLocation();
  };

  /** Reset zoom and move flags */
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

export default memo(GeoMap);
