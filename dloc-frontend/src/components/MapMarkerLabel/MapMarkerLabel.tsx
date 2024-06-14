import { Box } from '@mui/material';
import { Colors } from 'enums/Colors';
import { configApp } from 'config/configApp';
import { Device } from 'models/Device';
import { useTranslation } from 'react-i18next';
import { WifiOff } from '@mui/icons-material';
import BatteryIcon from 'components/BatteryIcon/BatteryIcon';
import calculateTime from 'functions/calculateTime';
import convertUTCDateToLocalDate from 'functions/convertUTCDateToLocalDate';
import style from './MapMarkerLabel.style';
import IconMarker from 'components/IconMarker/IconMarker';

const MapMarkerLabel = (props: MapMarkerLabelProps) => {
  const { device, zIndexOffset, hideTooltip, onClick = () => {}, opacity = 1, className = '' }: MapMarkerLabelProps = props;
  const { t } = useTranslation();

  const battery = !device.batteryLevel ? 0 : device.batteryLevel >= 95 ? 10 : Math.floor(device?.batteryLevel / 10);

  const dateLastPosition: Date | undefined = convertUTCDateToLocalDate(device.lastPositionUTC);
  const calculatedLastPosition = calculateTime(dateLastPosition ?? undefined, t('calculateTime', { returnObjects: true }));
  const outOffPosition = calculatedLastPosition.seconds > configApp.secondsOutOffPosition;

  const dateLastVisivility: Date | undefined = convertUTCDateToLocalDate(device.lastVisibilityUTC);
  const calculatedLastVisibility = calculateTime(dateLastVisivility ?? undefined, t('calculateTime', { returnObjects: true }));
  const outOffVisibility = calculatedLastVisibility.seconds > configApp.secondsOutOffVisibility;

  const finalClassName = `${className.trim()}${hideTooltip ? ' marker-no-tooltip' : ''}`;

  return (
    <Box onClick={onClick} className={finalClassName} {...style.containerProps} style={zIndexOffset ? { zIndex: zIndexOffset, opacity } : { opacity }}>
      {/* Device Name */}
      {!hideTooltip && <Box {...style.deviceNameProps}>{device.params.name}</Box>}

      {/* Last position */}
      {!hideTooltip && outOffPosition && (
        <Box {...style.deviceLastPositionProps}>
          <span style={{ color: Colors.red }}>{calculatedLastPosition.text}</span>
        </Box>
      )}

      {/* Battery */}
      <Box {...(!hideTooltip ? style.batteryProps : style.batteryTooltipHiddenProps)} {...style.batteryImageProps(battery * 10 < 3)}>
        <BatteryIcon iconSet={'bar'} level={outOffVisibility ? -1 : battery * 10} iconSize={24} fontSize={0} />
      </Box>

      {/* Marker Icon */}
      <IconMarker
        iconType={device.params.endTrack}
        hasImage={device.params.hasImage}
        fillColor={device.params.markerColor}
        imei={device.imei}
        sharedWithOthers={device.params.sharedWiths?.length > 0} 
        {...style.IconMarkerProps}
      />

      {/* Out of position */}
      {outOffVisibility && (
        <Box {...(!hideTooltip ? style.deviceOutOffVisibilityProps : style.deviceOutOffVisibilityTooltipHiddenProps)}>
          <WifiOff {...style.deviceOutOffVisibilityIconProps} />
        </Box>
      )}
    </Box>
  );
};

export default MapMarkerLabel;

interface MapMarkerLabelProps {
  device: Device;
  hideTooltip?: boolean;
  onClick?: () => void;
  opacity?: number;
  zIndexOffset?: number;
  className?: string;
}
