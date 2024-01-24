import { Box, SxProps } from '@mui/material';
import { Device } from 'models/Device';
import { useDevicesContext } from 'context/DevicesProvider';
import { useMapContext } from 'context/MapProvider';
import FilterCenterFocusIcon from '@mui/icons-material/FilterCenterFocus';
import PersonPinCircleIcon from '@mui/icons-material/PersonPinCircle';
import RampLeftIcon from '@mui/icons-material/RampLeft';
import { useEffect } from 'react';
import GeoMapDeviceButton from 'components/GeoMapDeviceButton/GeoMapDeviceButton';
import GeoMapButton from 'components/GeoMapButton/GeoMapButton';

const unSelectBackgroundColorProp: string = 'rgba(0, 0, 0, 0.1)';
const selectBackgroundColorProp: string = 'rgba(0, 0, 0, 0.5)';
const unSelectTextColorProp: string = 'red';
const selectTextColorProp: string = 'white';
const buttonsContainerProps: SxProps = { position: 'absolute', top: 0, right: 0, display: 'flex', mt: 1, mr: 1 };
const buttonContainerProps: SxProps = { backgroundColor: unSelectBackgroundColorProp, borderRadius: '50%', ml: 1 };
const buttonDeviceContainerProps: SxProps = { ...buttonContainerProps, borderRadius: '8px', display: 'flex', flexDirection: 'column', placeContent: 'center' };

const GeoMapButtons = () => {
  const { devices } = useDevicesContext();
  const { zoomChanged, mapMoved, onActions, setZoomChanged, setMapMoved, showPath, showDevices, centerOn, setCenterOn } = useMapContext();
  const boundState = !mapMoved && !zoomChanged;
  const boundColor: string = !boundState ? unSelectTextColorProp : selectTextColorProp;
  const showPathColor: string = !showPath ? unSelectTextColorProp : selectTextColorProp;
  const boundSx: SxProps = { backgroundColor: boundState ? selectBackgroundColorProp : unSelectBackgroundColorProp };
  const showPathSx: SxProps = { backgroundColor: showPath ? selectBackgroundColorProp : unSelectBackgroundColorProp };

  /** Set automatic bounds  */
  const handleClickCenterBounds = () => {
    if (!zoomChanged && !mapMoved) {
      setZoomChanged(true);
      setMapMoved(true);
    } else onActions.current.centerBounds(false, false);
  };

  /** Center on Device  */
  const handleCenterOnDevice = (device: Device) => {
    if (centerOn !== undefined && centerOn.imei === device.imei) {
      setCenterOn(undefined);
      return;
    }
    setCenterOn(device);
    onActions.current.centerOnDevice(device, true);
  };

  /** Center on my location  */
  const handleCenterMyLocation = () => {
    if (centerOn !== undefined) setCenterOn(undefined);
    onActions.current.centerMyLocation(false, true);
  };

  /** Show or hide path  */
  const handleShowPath = () => onActions.current.showPath(!showPath);

  /** Filter devices */
  const filteredDevices: Device[] = !devices ? [] : devices.filter((device: Device) => showDevices.includes('0') || showDevices.includes(device.imei));

  /**  */
  useEffect(() => {
    if (!zoomChanged && !mapMoved && centerOn) setCenterOn(undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zoomChanged, mapMoved, centerOn]);

  /** Release centerOn if device is not in filteredDevices */
  useEffect(() => {
    const filter: Device[] = filteredDevices.filter((device: Device) => centerOn?.imei === device.imei);
    if (filter.length === 0) setCenterOn(undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [devices]);

  return (
    <Box sx={buttonsContainerProps}>
      {filteredDevices.map((device) => (
        <GeoMapDeviceButton
          key={device.imei}
          device={device}
          onClick={handleCenterOnDevice}
          sx={buttonDeviceContainerProps}
          selectTextColorProp={selectTextColorProp}
          unSelectTextColorProp="black"
          selectBackgroundColorProp={selectBackgroundColorProp}
          unSelectBackgroundColorProp={unSelectBackgroundColorProp}
        />
      ))}

      {/* show path */}
      <GeoMapButton onClick={handleShowPath} sx={{ ...buttonContainerProps, ...showPathSx }}>
        <RampLeftIcon htmlColor={showPathColor} fontSize="inherit" />
      </GeoMapButton>

      {/* center on my location */}
      <GeoMapButton onClick={handleCenterMyLocation} sx={buttonContainerProps}>
        <PersonPinCircleIcon fontSize="inherit" />
      </GeoMapButton>

      {/* Center on on bounds */}
      <GeoMapButton onClick={handleClickCenterBounds} sx={{ ...buttonContainerProps, ...boundSx }}>
        <FilterCenterFocusIcon htmlColor={boundColor} fontSize="inherit" />
      </GeoMapButton>
    </Box>
  );
};

export default GeoMapButtons;
