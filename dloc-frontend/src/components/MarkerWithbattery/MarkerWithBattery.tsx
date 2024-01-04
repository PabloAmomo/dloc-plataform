import { Marker } from '@react-google-maps/api';
import MarkerLabel from 'components/MarkerLabel/MarkerLabel';
import { Box } from '@mui/material';
import { config } from 'config/config';
import markerIcon from 'functions/markerIcon';
import calculateTime from 'functions/calculateTime';
import { useTranslation } from 'react-i18next';
import { Device } from 'models/Device';
import convertUTCDateToLocalDate from 'functions/convertUTCDateToLocalDate';

interface OnClick {
  (device: Device): void;
}

const MarkerWithBattery = ({ device, onClick }: { device: Device; onClick: OnClick }) => {
  const { t } = useTranslation();

  const battery = !device.batteryLevel ? 0 : device.batteryLevel >= 95 ? 10 : Math.floor(device?.batteryLevel / 10);
  const date: Date = convertUTCDateToLocalDate(device.lastPositionUTC ?? undefined);
  const time: string = calculateTime(date ?? undefined, t('calculateTime', { returnObjects: true }));
  const location = { lat: device.lat, lng: device.lng };
  const image: string = `images/battery/battery-${battery}.png`;

  const handleOnClick = () => onClick && onClick(device);

  return (
    <Marker
      onClick={handleOnClick}
      zIndex={config.map.zIndex.endPoint}
      title={device.params.name}
      icon={markerIcon(device.params.endTrack, { fillColor: device.params.colorLight })}
      position={location}
    >
      <MarkerLabel
        size={72}
        onClick={handleOnClick}
        sxLine1={{ textAlign: 'center' }}
        sxLine2={{ fontSize: '8px', textAlign: 'center' }}
        position={location}
        line1={device.params.name}
        line2={time}
      >
        <Box sx={{ position: 'absolute', right: 4, top: '-20px' }}>
          <img className={`batery-icon d-block${battery === 0 ? ' blink_50' : ''}`} src={image} alt={'Battery State'} />
        </Box>
      </MarkerLabel>
    </Marker>
  );
};

export default MarkerWithBattery;
