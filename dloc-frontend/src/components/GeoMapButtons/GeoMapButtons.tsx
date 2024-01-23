import { Box, IconButton, SxProps, Typography } from '@mui/material';
import { Device } from 'models/Device';
import { useDevicesContext } from 'context/DevicesProvider';
import { useMapContext } from 'context/MapProvider';
import FilterCenterFocusIcon from '@mui/icons-material/FilterCenterFocus';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import PersonPinCircleIcon from '@mui/icons-material/PersonPinCircle';
import RampLeftIcon from '@mui/icons-material/RampLeft';

const backgroundColor = 'rgba(0, 0, 0, 0.1)';
const buttonsContainerProps: SxProps = { position: 'absolute', top: 0, right: 0, display: 'flex', mt: 1, mr: 1 };
const buttonContainerProps: SxProps = { backgroundColor, borderRadius: '50%', ml: 1 };
const buttonDeviceContainerProps: SxProps = { ...buttonContainerProps, borderRadius: '8px', display: 'flex', flexDirection: 'column', placeContent: 'center' };

const GeoMapButtons = () => {
  const { devices } = useDevicesContext();
  const { zoomChanged, mapMoved, onActions, setZoomChanged, setMapMoved, showPath, showDevices, centerOn } = useMapContext();
  const boundColor: string = (mapMoved ?? false) || (zoomChanged ?? false) ? 'red' : 'inherit';
  const showPathColor: string = !showPath ?? false ? 'red' : 'inherit';

  /** Set automatic bounds  */
  const handleClickCenterBounds = () => {
    if (!zoomChanged && !mapMoved) {
      setZoomChanged(true);
      setMapMoved(true);
    } else onActions.current.centerBounds(false, false);
  };

  /** Center on Device  */
  const handleCenterOnDevice = (device: Device) => onActions.current.centerOnDevice(device, true, true);

  /** Center on my location  */
  const handleCenterMyLocation = () => onActions.current.centerMyLocation(false, false);

  /** Show or hide path  */
  const handleShowPath = () => onActions.current.showPath(!showPath);

  return (
    <Box sx={buttonsContainerProps}>
      {devices && devices.filter((device: Device) => showDevices.includes('0') || showDevices.includes(device.imei)).map((device) => (
        <Box key={device.imei} sx={{...buttonDeviceContainerProps, backgroundColor: (centerOn ? 'rgba(0, 0, 0, 0.5)' : backgroundColor) }}>
          <IconButton onClick={() => handleCenterOnDevice(device)} size="large">
            <MyLocationIcon fontSize={"small"} htmlColor={centerOn ? 'white' : 'inherit'} />
            <Typography variant="caption" color={centerOn ? 'white' : 'black'} ml={1} >{device.params.name}</Typography>
          </IconButton>
        </Box>
      ))}

      <Box sx={buttonContainerProps}>
        <IconButton onClick={handleShowPath} size="large">
          <RampLeftIcon htmlColor={showPathColor} fontSize="inherit" />
        </IconButton>
      </Box>

      <Box sx={buttonContainerProps}>
        <IconButton onClick={handleCenterMyLocation} size="large">
          <PersonPinCircleIcon fontSize="inherit" />
        </IconButton>
      </Box>

      <Box sx={buttonContainerProps}>
        <IconButton onClick={handleClickCenterBounds} size="large">
          <FilterCenterFocusIcon htmlColor={boundColor} fontSize="inherit" />
        </IconButton>
      </Box>
    </Box>
  );
};

export default GeoMapButtons;
