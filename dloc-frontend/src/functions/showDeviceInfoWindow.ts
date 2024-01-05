import { Device } from "models/Device";
import convertUTCDateToLocalDate from "./convertUTCDateToLocalDate";
import formatDate from "./formatDate";
import createInfoWindow from "./createInfoWindow";

const showDeviceInfoWindow = (device: Device, currentInfoWindows: React.MutableRefObject<google.maps.InfoWindow | undefined>, map: any, t: any) => {
  if (device.lat == null || device.lng == null) return;
  const date: string = formatDate(convertUTCDateToLocalDate(device.lastPositionUTC ?? undefined), t('dateString')) ?? '-';
  const dateVisibility: string = formatDate(convertUTCDateToLocalDate(device.lastVisibilityUTC ?? undefined), t('dateString')) ?? '-';
  const title: string = device.params.name;
  const battery: string = '' + (device?.batteryLevel ?? '0');
  const content = `<div>${t('lastTime')}: <b>${date}</b></div>
                     <div>${t('lastVisibility')}: <b>${dateVisibility}</b></div>
                     <div>${t('battery')}: <b>${battery}%</b></div>
                     <div>lat: <i>${device?.lat ?? '-'}</i></div>
                     <div>lng: <i>${device?.lng ?? '-'}</i></div>`;
  const position = new google.maps.LatLng(device.lat, device.lng);
  if (currentInfoWindows) currentInfoWindows.current = createInfoWindow({ open: true, title, content, position, map, currentInfoWindows: currentInfoWindows.current });
};

export default showDeviceInfoWindow;