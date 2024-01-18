import { Device } from 'models/Device';
import convertUTCDateToLocalDate from './convertUTCDateToLocalDate';
import formatDate from './formatDate';
import createGoogleInfoWindow from './createGoogleInfoWindow';
import calculateTime from './calculateTime';
import { MapPath } from 'models/MapPath';

const showDeviceGoogleInfoWindow = (device: Device, currentInfoWindows: React.MutableRefObject<google.maps.InfoWindow | undefined>, map: any, t: any, deviceMapPath : MapPath | undefined, showDistance : boolean) => {
  if (device.lat == null || device.lng == null) return;
  const datePosition: Date = convertUTCDateToLocalDate(device.lastPositionUTC ?? undefined);
  const dateVisibility: Date = convertUTCDateToLocalDate(device.lastVisibilityUTC ?? undefined);
  const datePositionText: string = formatDate(datePosition, t('dateString')) ?? '-';
  const dateVisibilityText: string = formatDate(dateVisibility, t('dateString')) ?? '-';
  const i18n: any = t('calculateTime', { returnObjects: true });
  const calculatedTimePosition: string = datePosition ? `(${calculateTime(datePosition, i18n).text.toLowerCase()})` : '';
  const calculatedTimeVisibility: string = dateVisibility ? `(${calculateTime(dateVisibility, i18n).text.toLowerCase()})` : '';

  const title: string = device.params.name;
  const battery: string = '' + (device?.batteryLevel ?? '0');
  const distance: string = `<div>${t('distance')}: <b>${deviceMapPath?.distance?.toFixed(0) ?? 0} m</b></div>`;
  
  const content = ` <div>${t('lastTime')}: <b>${datePositionText}</b> ${calculatedTimePosition}</div>
                    ${showDistance ? distance : ''}
                    <div>${t('battery')}: <b>${battery}%</b></div>
                    <div>&nbsp;</div>
                    <div>${t('lastVisibility')}: <b>${dateVisibilityText}</b> ${calculatedTimeVisibility}</div>
                    <div>lat: <i>${device?.lat ?? '-'}</i></div>
                    <div>lng: <i>${device?.lng ?? '-'}</i></div>`;
  const position = new google.maps.LatLng(device.lat, device.lng);

  if (currentInfoWindows)
    currentInfoWindows.current = createGoogleInfoWindow({ open: true, title, content, position, map, currentInfoWindows: currentInfoWindows.current });
};

export default showDeviceGoogleInfoWindow;
