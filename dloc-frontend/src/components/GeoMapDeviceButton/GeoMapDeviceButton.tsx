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
  const isCenterOn: boolean = centerOn?.device?.imei === device.imei;

  return (
    <Box key={device.imei} sx={{ ...sx, backgroundColor: isCenterOn ? selectBackgroundColorProp : unSelectBackgroundColorProp }}>
      <IconButton onClick={() => onClick(device)} size="large">
        <MyLocationIcon fontSize={'small'} htmlColor={isCenterOn ? selectTextColorProp : 'inherit'} />
        <Typography variant="caption" color={isCenterOn ? selectTextColorProp : unSelectTextColorProp} ml={1}>
          {device.params.name}
        </Typography>
      </IconButton>
    </Box>
  );
};

export default GeoMapDeviceButton;
