import { LatLng } from 'models/LatLng';

const getMyPosition = (onPosition: { (position: LatLng): void }, onError: { (error: Error): void }) => {
  if (!('geolocation' in navigator)) {
    onError && onError(new Error('Geolocation is not supported by this browser.'));
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      if (position.coords === null) onError && onError(new Error('Invalid location.'));
      else onPosition && onPosition({ lat: position.coords.latitude, lng: position.coords.longitude });
    },
    (error: GeolocationPositionError) => onError && onError(new Error(error.message))
  );
};

export default getMyPosition;
