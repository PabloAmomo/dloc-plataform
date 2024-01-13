import { config } from 'config/config';
import { GoogleMap as GMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import { LinearProgress } from '@mui/material';
import CircularLoading from 'components/CircularLoading/CircularLoading';
import ContainerTop from 'components/ContainerTop/ContainerTop';
import React, { ReactElement, ReactNode, useEffect, useRef } from 'react';
import { LatLng } from 'models/LatLng';
import markerIcon from 'functions/markerIcon';
import { Device } from 'models/Device';
import MarkerWithBattery from 'components/MarkerWithbattery/MarkerWithBattery';
import { useDevicesContext } from 'context/DevicesProvider';
import { useUserContext } from 'context/UserProvider';
import { useTranslation } from 'react-i18next';
import googleMapFitDevices from 'functions/googleMapFitDevices';
import showDeviceInfoWindow from 'functions/showDeviceInfoWindow';

const containerStyle = { width: '100%', height: '100%' };
const mapCenter = config.map.initCenter;
const mapOptions = { zoomControl: true, streetViewControl: false, mapTypeControl: false, fullscreenControl: false, maxZoom: config.map.maxZoom };
const mapPOIConfig = { featureType: 'poi', stylers: [{ visibility: 'off' }] };
const mapTransitConfig = { featureType: 'transit', stylers: [{ visibility: 'off' }], elementType: 'labels.icon' };

const GoogleMap = ({ isLoading, myPosition, showDevices }: { isLoading: boolean; myPosition: LatLng | null; showDevices: string[] }) => {
  const { t } = useTranslation();
  const { devices } = useDevicesContext();
  const { user } = useUserContext();
  const { isLoaded } = useJsApiLoader({ id: 'google-map-script', googleMapsApiKey: config.googleMapsApiKey });
  const currentInfoWindows = useRef<google.maps.InfoWindow>();
  const [map, setMap] = React.useState<any>(null);
  const [myPositionMarker, setMyPositionMarker] = React.useState<google.maps.LatLng | null>(null);
  const [markers, setMarkers] = React.useState<ReactNode[]>([]);

  /** Handle click on device */
  const handleClickOnDevice = (device: Device) => showDeviceInfoWindow(device, currentInfoWindows, map, t);

  /** Create Device Makers */
  useEffect(() => {
    if (!map || !isLoaded || devices.length === 0) return;

    const markersTemp: ReactNode[] = devices.map((device: Device) => (
      <MarkerWithBattery key={`${device.imei}`} onClick={handleClickOnDevice} device={device} />
    ));
    setMarkers(markersTemp);

    googleMapFitDevices({ map, devices, showDevices, myPosition });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [devices, map, isLoaded]);

  /** Close info window when click on Map */
  const handleOnClick = () => currentInfoWindows.current && currentInfoWindows.current.close();

  /** Set my position marker */
  useEffect(() => {
    if (myPosition && google?.maps?.LatLng) setMyPositionMarker(new google.maps.LatLng(myPosition.lat, myPosition.lng));
  }, [myPosition, map]);

  /** Zoom (Max Zoom) */
  const handleOnZoomChanged = () => {
    if (!map || !isLoaded) return;
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
        mapContainerStyle={containerStyle}
        center={mapCenter}
        onLoad={onLoad}
        onUnmount={onUnmount}
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

      {/* Linear Loading */}
      <ContainerTop height={isLoading ? 4 : 0}>
        <LinearProgress color="primary" />
      </ContainerTop>
    </>
  );
};

export default React.memo(GoogleMap);
