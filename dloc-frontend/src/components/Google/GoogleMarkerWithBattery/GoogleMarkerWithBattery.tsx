import { Box } from '@mui/material';
import { config } from 'config/config';
import { Device } from 'models/Device';
import { LatLng } from 'models/LatLng';
import { Marker } from '@react-google-maps/api';
import { useTranslation } from 'react-i18next';
import calculateTime from 'functions/calculateTime';
import convertUTCDateToLocalDate from 'functions/convertUTCDateToLocalDate';
import googleMarkerIcon from 'functions/Google/googleMarkerIcon';
import GoogleMarkerLabel from 'components/Google/GoogleMarkerLabel/GoogleMarkerLabel';

interface OnClick {
  (device: Device): void;
}

const secondsRedText = 120;

const GoogleMarkerWithBattery = ({ device, onClick }: { device: Device; onClick: OnClick }) => {
  const { t } = useTranslation();

  const battery = !device.batteryLevel ? 0 : device.batteryLevel >= 95 ? 10 : Math.floor(device?.batteryLevel / 10);
  const date: Date = convertUTCDateToLocalDate(device.lastPositionUTC ?? undefined);
  const calculated = calculateTime(date ?? undefined, t('calculateTime', { returnObjects: true }));
  const location: LatLng = { lat: device.lat, lng: device.lng };
  const image: string = `images/battery/battery-${battery}.png`;
  const batteryClass: string = `batery-icon d-block${battery === 0 ? ' blink_50' : ''}`;
  const timeColor: string = calculated.seconds > secondsRedText ? 'red' : 'inherit';

  const handleOnClick = () => onClick && onClick(device);

  return (
    <Marker
      onClick={handleOnClick}
      zIndex={config.map.zIndex.endPoint}
      title={device.params.name}
      icon={googleMarkerIcon(device.params.endTrack, { fillColor: device.params.markerColor })}
      position={location}
    >
      <GoogleMarkerLabel
        size={72}
        onClick={handleOnClick}
        sxLine1={{ textAlign: 'center' }}
        sxLine2={{ fontSize: '8px', textAlign: 'center', color: timeColor }}
        position={location}
        line1={device.params.name}
        line2={calculated.text}
      >
        <Box sx={{ position: 'absolute', right: 4, top: '-22px' }}>
          <img className={batteryClass} src={image} alt={'Battery State'} />
        </Box>
      </GoogleMarkerLabel>
    </Marker>
  );
};

export default GoogleMarkerWithBattery;
