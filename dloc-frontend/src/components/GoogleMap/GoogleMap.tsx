import { config } from 'config/config';
import { Device } from 'models/Device';
import { GoogleMap as GMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import { useDevicesContext } from 'context/DevicesProvider';
import { useTranslation } from 'react-i18next';
import { useUserContext } from 'context/UserProvider';
import CircularLoading from 'components/CircularLoading/CircularLoading';
import googleMapFitDevices from 'functions/googleMapFitDevices';
import markerIcon from 'functions/markerIcon';
import GoogleMarkerWithBattery from 'components/GoogleMarkerWithBattery/GoogleMarkerWithBattery';
import React, { ReactElement, ReactNode, useEffect, useRef } from 'react';
import showDeviceGoogleInfoWindow from 'functions/showDeviceGoogleInfoWindow';
import { useMapContext } from 'context/MapProvider';

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
  const { isLoaded } = useJsApiLoader({ id: 'google-map-script', googleMapsApiKey: config.googleMapsApiKey });
  const currentInfoWindows = useRef<google.maps.InfoWindow>();
  const [map, setMap] = React.useState<any>(null);
  const [myPositionMarker, setMyPositionMarker] = React.useState<google.maps.LatLng | null>(null);
  const [markers, setMarkers] = React.useState<ReactNode[]>([]);

  /** Handle click on device */
  const handleClickOnDevice = (device: Device) => showDeviceGoogleInfoWindow(device, currentInfoWindows, map, t);

  /** Set actions for parent */
  onActions.current = {
    centerBounds: () => {
      googleMapFitDevices({ map, devices, showDevices, myPosition });
    },
    centerMyLocation: () => {
      googleMapFitDevices({ map, myPosition });
    },
  };

  /** Create Device Makers */
  useEffect(() => {
    if (!map || !isLoaded || devices.length === 0) return;

    const markersTemp: ReactNode[] = devices.map((device: Device) => (
      <GoogleMarkerWithBattery key={`${device.imei}`} onClick={handleClickOnDevice} device={device} />
    ));
    setMarkers(markersTemp);

    /** Center and bound if not zoom or map moved by user */
    const [ oldZoomChanged, oldMapMoved ] = [ zoomChanged, mapMoved ];
    if (!zoomChanged && !mapMoved) googleMapFitDevices({ map, devices, showDevices, myPosition });

    /** Restore the user states, changed by googleMapFitDevice */
    setZoomChanged(oldZoomChanged);
    setMapMoved(oldMapMoved);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [devices, map, isLoaded]);

  /** Close info window when click on Map */
  const handleOnClick = () => currentInfoWindows.current && currentInfoWindows.current.close();

  /** Set my position marker */
  useEffect(() => {
    if (myPosition && google?.maps?.LatLng) setMyPositionMarker(new google.maps.LatLng(myPosition.lat, myPosition.lng));
  }, [myPosition, map]);

  /** Drag */
  const handleOnDragEnd = () => {
    if (!map || !isLoaded) return;

    if (zoomChanged === undefined) setZoomChanged(false);

    if (mapMoved === undefined) setMapMoved(false);
    else if (!mapMoved) setMapMoved(true);
  };

  /** Zoom */
  const handleOnZoomChanged = () => {
    if (!map || !isLoaded) return;

    if (mapMoved === undefined) setMapMoved(false);

    if (zoomChanged === undefined) setZoomChanged(false);
    else if (!zoomChanged) setZoomChanged(true);

    /** Max zoom */
    if ((map?.getZoom() ?? 0) > config.map.maxZoom) map.setZoom(config.map.maxZoom);
  };

  /** Map */
  const onLoad = React.useCallback((map: any) => setMap(map), []);
  const onUnmount = React.useCallback(() => setMap(null), []);

  /** Draw the Map */
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
        onClick={handleOnClick}
        options={{ ...mapOptions, styles: [mapPOIConfig, mapTransitConfig] }}
      >
        {/* Device Markers */}
        {markers &&
          markers
            .filter((marker: ReactNode) => showDevices.includes('0') || showDevices.includes('' + ((marker as ReactElement)?.key ?? '')))
            .map((item: ReactNode) => item)}

        {/* My Position Marker */}
        {myPositionMarker && user && <Marker zIndex={config.map.zIndex.me} icon={markerIcon(user.iconOnMap)} position={myPositionMarker} />}
      </GMap>
    </>
  );
};

export default React.memo(GoogleMap);
