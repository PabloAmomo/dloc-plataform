import { GetPositionsResult } from 'models/GetPositionsResult';
import { LinearProgress } from '@mui/material';
import { memo, useEffect, useRef, useState } from 'react';
import { useDevicesContext } from 'context/DevicesProvider';
import { useMapContext } from 'context/MapProvider';
import { useSnackContext } from 'context/SnackProvider';
import ContainerAllScreen from 'components/ContainerAllScreen/ContainerAllScreen';
import ContainerTop from 'components/ContainerTop/ContainerTop';
import GeoMapBottomMenu from 'components/GeoMapBottomMenu/GeoMapBottomMenu';
import GeoMapButtons from 'components/GeoMapButtons/GeoMapButtons';
import getPositions from 'services/getPositions/getPositions';
import GoogleMap from 'components/Google/GoogleMap/GoogleMap';
import LastUpdateInfo from 'components/LastUpdateInfo/LastUpdateInfo';
import logError from 'functions/logError';
import processDevices from 'functions/processDevices';

function GeoMap() {
  const [tick, setTick] = useState<number>(0);
  const { addSnackbar } = useSnackContext();
  const { devices, setDevices } = useDevicesContext();
  const { isLoading, setIsLoading, minutes, centerOn, onActions } = useMapContext();
  const abortAxios = useRef<AbortController>();

  /** Force repaint path when minutes change */
  useEffect(() => {
    setTick(Date.now());
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [minutes]);

  /** Update all device positions */
  useEffect(() => {
    setIsLoading(true);

    /** Update devices */
    getPositions(
      { interval: minutes },
      (response: GetPositionsResult) => {
        try {
          // TODO: Add error handler if response has error...
          if (response?.error) throw new Error(response.error?.message ?? response.error);
        
          setDevices(processDevices(response, devices));
          
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

  /** Center on device */
  useEffect(() => {
    if (!centerOn) return;
    onActions.current.centerOnDevice(centerOn.device, centerOn.changeZoom);
  }, [centerOn, onActions]);

  /** Devices changed */
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => setIsLoading(false), [devices]);

  useEffect(() => {
    /** Update device positions every 5 seconds */
    const timer = setInterval(() => setTick(Date.now()), 5000);
    return () => clearInterval(timer);
  }, []);

  /** Draw the Map */
  return (
    <>
      <ContainerAllScreen>
        {/* Map */}
        <GoogleMap />

        {/* Action Buttons */}
        <GeoMapButtons />

        {/* Last update */}
        <LastUpdateInfo />

        {/* Linear Loading */}
        <ContainerTop height={isLoading ? 4 : 0}>
          <LinearProgress color="primary" />
        </ContainerTop>
      </ContainerAllScreen>

      <GeoMapBottomMenu hideDevicesSelector={devices.length === 0} />
    </>
  );
}

export default memo(GeoMap);
