import { config } from 'config/config';
import { Device } from 'models/Device';
import { LatLng } from 'models/LatLng';

const googleMapFitDevices = ({
  map,
  isLoaded,
  myPosition,
  showDevices,
  devices,
}: {
  map: any;
  isLoaded: boolean;
  myPosition: LatLng | null;
  showDevices: string[];
  devices: Device[];
}) => {
  if (!map || !isLoaded || !myPosition || devices.length === 0) return;

  let bounds: google.maps.LatLngBounds = new google.maps.LatLngBounds();

  /** My Position */
  if (myPosition) bounds.extend(new google.maps.LatLng(myPosition.lat, myPosition.lng));

  /** Add device positions */
  let count : number = 0;
  devices.forEach((device: Device) => {
    if (showDevices.includes('0') || showDevices.includes(device.imei)) {
      count++;
      bounds.extend(new google.maps.LatLng(device.lat, device.lng));
    }
  });

  /** Nothing to extend */
  if (count === 0 && !myPosition) return;

  /** Already fitBounds - Not need to fit again */
  let boundData: { south: number; west: number; north: number; east: number } = bounds.toJSON();
  if (JSON.stringify(boundData) === JSON.stringify(new google.maps.LatLngBounds().toJSON())) return;

  /** Fit Bounds and Zoom */
  map.fitBounds(bounds);
  if (boundData.south === boundData.north && boundData.west === boundData.east) map.setZoom(config.map.zoomNormal - 2);
};

export default googleMapFitDevices;
