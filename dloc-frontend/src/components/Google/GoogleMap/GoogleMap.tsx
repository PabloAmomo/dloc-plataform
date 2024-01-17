import { config } from 'config/config';
import { Device } from 'models/Device';
import { GoogleMap as GMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { useDevicesContext } from 'context/DevicesProvider';
import { useMapContext } from 'context/MapProvider';
import { useTranslation } from 'react-i18next';
import { useUserContext } from 'context/UserProvider';
import CircularLoading from 'components/CircularLoading/CircularLoading';
import googleMapFitDevices from 'functions/googleMapFitDevices';
import GoogleMarkerWithBattery from 'components/Google/GoogleMarkerWithBattery/GoogleMarkerWithBattery';
import markerIcon from 'functions/markerIcon';
import showDeviceGoogleInfoWindow from 'functions/showDeviceGoogleInfoWindow';

const mapContainerStyle = { width: '100%', height: '100%' };
const mapCenter = config.map.initCenter;
const mapOptions = { zoomControl: true, streetViewControl: false, mapTypeControl: false, fullscreenControl: false, maxZoom: config.map.maxZoom };
const mapPOIConfig = { featureType: 'poi', stylers: [{ visibility: 'off' }] };
const mapTransitConfig = { featureType: 'transit', stylers: [{ visibility: 'off' }], elementType: 'labels.icon' };

const GoogleMap = () => {
  const { t } = useTranslation();
  const { zoomChanged, mapMoved, setZoomChanged, setMapMoved, myPosition, onActions, showDevices } = useMapContext();
  const { devices } = useDevicesContext();
  const { user } = useUserContext();
  const [userDevices, setUserDevices] = useState<Device[]>(devices);

  /** Google Map */
  const { isLoaded } = useJsApiLoader({ id: 'google-map-script', googleMapsApiKey: config.googleMapsApiKey });
  const currentInfoWindows = useRef<google.maps.InfoWindow>();
  const [map, setMap] = useState<any>();
  const [myPos, setMyPos] = useState<google.maps.LatLng | google.maps.LatLngLiteral | undefined>();

  /** Center and bound */
  const googleFitAndZoom = (zoomChangeState: boolean, mapMovedState: boolean, options: any) => {
    setZoomChanged(zoomChangeState);
    setMapMoved(mapMovedState);
    googleMapFitDevices(options);
    setZoomChanged(zoomChangeState);
    setMapMoved(mapMovedState);
  };

  /** Set actions for parent */
  onActions.current = {
    clickOnDevice: (device: Device) => showDeviceGoogleInfoWindow(device, currentInfoWindows, map, t),
    centerBounds: (zoomChangeState: boolean, mapMovedState: boolean) => googleFitAndZoom(zoomChangeState, mapMovedState, { map, devices, showDevices, myPosition }),
    centerMyLocation: (zoomChangeState: boolean, mapMovedState: boolean) => googleFitAndZoom(zoomChangeState, mapMovedState, { map, myPosition }),
    mapReady: () => map && isLoaded,
    clickOnMap: () => currentInfoWindows.current && currentInfoWindows.current.close(),
    getZoom: () => map?.getZoom() ?? 0,
    setZoom: (zoom: number) => {
      if (zoom > config.map.maxZoom) zoom = config.map.maxZoom;
      map?.setZoom(zoom);
    },
  };

  /** My Position Change */
  useEffect(() => {
    if (myPosition && google?.maps?.LatLng) setMyPos(new google.maps.LatLng(myPosition.lat, myPosition.lng));
  }, [myPosition, isLoaded, map]);

  /** Devices Change */
  useEffect(() => {
    /** Exit if map not ready */
    if (!onActions.current.mapReady()) return;

    /** Set the devices */
    setUserDevices(devices);

    /** Center and bound if not zoom or map moved by user */
    if (!zoomChanged && !mapMoved) onActions.current.centerBounds(zoomChanged ?? false, mapMoved ?? false);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [devices, map, isLoaded]);

  /** Drag */
  const handleOnDragEnd = () => {
    if (!onActions.current.mapReady()) return;

    if (zoomChanged === undefined) setZoomChanged(false);

    if (mapMoved === undefined) setMapMoved(false);
    else if (!mapMoved) setMapMoved(true);
  };

  /** Zoom */
  const handleOnZoomChanged = () => {
    if (!onActions.current.mapReady()) return;

    if (mapMoved === undefined) setMapMoved(false);

    if (zoomChanged === undefined) setZoomChanged(false);
    else if (!zoomChanged) setZoomChanged(true);

    /** Limit to max zoom */
    if (onActions.current.getZoom() > config.map.maxZoom) onActions.current.setZoom(config.map.maxZoom);
  };

  /** Map */
  const handleOnMapClick = (event: any) => onActions.current.clickOnMap(event);
  const onLoad = useCallback((map: any) => setMap(map), []);
  const onUnmount = useCallback(() => setMap(undefined), []);

  /** Draw the Map or Loading */
  return !isLoaded ? (
    <CircularLoading />
  ) : (
    <>
      <GMap
        mapContainerStyle={mapContainerStyle}
        center={mapCenter}
        onLoad={onLoad}
        onUnmount={onUnmount}
        onDragEnd={handleOnDragEnd}
        zoom={config.map.initZoom}
        onZoomChanged={handleOnZoomChanged}
        onClick={handleOnMapClick}
        options={{ ...mapOptions, styles: [mapPOIConfig, mapTransitConfig] }}
      >
        {/* Device Markers */}
        {userDevices &&
          userDevices
            .filter((device: Device) => showDevices.includes('0') || showDevices.includes(device.imei))
            .map((device: Device) => (
              <GoogleMarkerWithBattery key={`${device.imei}-${device.lastPositionUTC}`} onClick={onActions.current.clickOnDevice} device={device} />
            ))}

        {/* My Position Marker */}
        {myPos && user && <Marker zIndex={config.map.zIndex.me} icon={markerIcon(user.iconOnMap)} position={myPos} />}
      </GMap>
    </>
  );
};

export default memo(GoogleMap);
