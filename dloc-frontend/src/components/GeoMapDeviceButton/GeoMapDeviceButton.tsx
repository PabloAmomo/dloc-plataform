import { Box, IconButton, SxProps, Typography } from '@mui/material';
import { Device } from 'models/Device';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import { useMapContext } from 'context/MapProvider';

type GeoMapDeviceButtonProps = {
  device: Device;
  onClick: (device: Device) => void;
  sx: SxProps;
  selectTextColorProp: string;
  unSelectTextColorProp: string;
  unSelectBackgroundColorProp: string;
  selectBackgroundColorProp: string;
};

const GeoMapDeviceButton = ({
  device,
  onClick,
  sx,
  selectTextColorProp,
  unSelectTextColorProp,
  selectBackgroundColorProp,
  unSelectBackgroundColorProp,
}: GeoMapDeviceButtonProps) => {
  const { centerOn } = useMapContext();

  return (
    <Box key={device.imei} sx={{ ...sx, backgroundColor: centerOn?.imei === device.imei ? selectBackgroundColorProp : unSelectBackgroundColorProp }}>
      <IconButton onClick={() => onClick(device)} size="large">
        <MyLocationIcon fontSize={'small'} htmlColor={centerOn?.imei === device.imei ? selectTextColorProp : 'inherit'} />
        <Typography variant="caption" color={centerOn?.imei === device.imei ? selectTextColorProp : unSelectTextColorProp} ml={1}>
          {device.params.name}
        </Typography>
      </IconButton>
    </Box>
  );
};

export default GeoMapDeviceButton;
