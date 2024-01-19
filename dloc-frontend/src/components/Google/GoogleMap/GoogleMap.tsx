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
import { MapPath } from 'models/MapPath';
import { Path } from 'models/Path';

const mapOptions = { zoomControl: true, streetViewControl: false, mapTypeControl: false, fullscreenControl: false, maxZoom: config.map.maxZoom };
const mapPOIConfig = { featureType: 'poi', stylers: [{ visibility: 'off' }] };
const mapTransitConfig = { featureType: 'transit', stylers: [{ visibility: 'off' }], elementType: 'labels.icon' };

const GoogleMap = () => {
  const { t } = useTranslation();
  const { zoomChanged, mapMoved, setZoomChanged, setMapMoved, myPosition, onActions, showDevices, showPath, setShowPath, mapPaths, addMapPaths } =
    useMapContext();
  const { devices } = useDevicesContext();
  const { user } = useUserContext();
  const [userDevices, setUserDevices] = useState<Device[]>(devices);

  /** For Google Map */
  const { isLoaded } = useJsApiLoader({ id: 'google-map-script', googleMapsApiKey: config.googleMapsApiKey });
  const currentInfoWindows = useRef<google.maps.InfoWindow>();
  const [map, setMap] = useState<any>();
  const [myPos, setMyPos] = useState<google.maps.LatLng | google.maps.LatLngLiteral | undefined>();
  const [pathsToDraw, setPathsToDraw] = useState<any>({});

  /** Set actions for parent and other controls */
  onActions.current = {
    mapReady: () => map && isLoaded,
    clickOnDevice: (device: Device) => showDeviceGoogleInfoWindow(device, currentInfoWindows, map, t, findMapPath(device.imei), showPath),
    clickOnMap: () => currentInfoWindows.current && currentInfoWindows.current.close(),

    centerBounds: (zoomState: boolean, movedState: boolean) => googleFitAndZoom(zoomState, movedState, { map, devices, showDevices, myPosition }),
    centerMyLocation: (zoomState: boolean, movedState: boolean) => googleFitAndZoom(zoomState, movedState, { map, myPosition }),

    showPath: (showPath: boolean) => setShowPath(showPath),

    getZoom: () => map?.getZoom() ?? 0,
    setZoom: (zoom: number) => map?.setZoom(zoom > config.map.maxZoom ? config.map.maxZoom : zoom),
  };

  /** Show or hide path */
  useEffect(() => {
    for (const key in pathsToDraw) pathsToDraw[key].polilyne.setMap(showPath ? map : null);
  }, [showPath, pathsToDraw, map]);

  /** Center and bound */
  const googleFitAndZoom = (zoomChangeState: boolean, mapMovedState: boolean, options: any) => {
    setZoomChanged(zoomChangeState);
    setMapMoved(mapMovedState);
    googleMapFitDevices(options);
    setZoomChanged(zoomChangeState);
    setMapMoved(mapMovedState);
  };

  /** Find MapPath by IMEI */
  const findMapPath = (imei: string): MapPath | undefined => mapPaths?.find((mapPath: MapPath) => mapPath.imei === imei);

  /** My Position Change */
  useEffect(() => {
    if (myPosition && google?.maps?.LatLng) setMyPos(new google.maps.LatLng(myPosition.lat, myPosition.lng));
  }, [myPosition, isLoaded, map]);

  /** Devices Change */
  useEffect(() => {
    /** Exit if map not ready */
    if (!onActions.current.mapReady()) return;

    /** Add mapPaths */
    addMapPaths(devices);

    /** Set the devices */
    setUserDevices(devices);

    /** Center and bound if not zoom or map moved by user */
    if (!zoomChanged && !mapMoved) onActions.current.centerBounds(zoomChanged ?? false, mapMoved ?? false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [devices, map, isLoaded]);

  /** Drag */
  const handleOnDragEnd = () => {
    if (!onActions.current.mapReady()) return;

    if (mapMoved === undefined) setMapMoved(false);
    else if (!mapMoved) setMapMoved(true);
  };

  /** Zoom */
  const handleOnZoomChanged = () => {
    if (!onActions.current.mapReady()) return;

    /** Limit to max zoom */
    if (onActions.current.getZoom() > config.map.maxZoom) {
      onActions.current.setZoom(config.map.maxZoom);
      return;
    }

    if (zoomChanged === undefined) setZoomChanged(false);
    else if (!zoomChanged) setZoomChanged(true);
  };

  /** Map */
  const handleOnMapClick = (event: any) => onActions.current.clickOnMap(event);
  const onLoad = useCallback((map: any) => setMap(map), []);
  const onUnmount = useCallback(() => setMap(undefined), []);

  /** Create Map Paths */
  useEffect(() => {
    const newPathToDraw: any = { ...pathsToDraw };
    const keys: string[] = [];

    mapPaths?.forEach((mapPath: MapPath, index: number) => {
      mapPath.path?.forEach((path: Path) => {
        const route = [new google.maps.LatLng(path.start.lat, path.start.lng), new google.maps.LatLng(path.end.lat, path.end.lng)];
        const lastRoute = route[route.length - 1];
        const key: string = `${mapPath.imei}-${route[0].lat()}-${route[0].lng()}-${lastRoute.lat()}-${lastRoute.lng()}`;

        /** Save the key for remove old paths */
        keys.push(key);

        if (!newPathToDraw[key]) {
          const polilyne: google.maps.Polyline = new google.maps.Polyline({
            strokeColor: mapPath.color,
            strokeOpacity: mapPath.strokeOpacity,
            strokeWeight: mapPath.strokeWeight,
            path: route,
          });
          newPathToDraw[key] = {
            start: { lat: route[0].lat(), lng: route[0].lng() },
            end: { lat: lastRoute.lat(), lng: lastRoute.lng() },
            polilyne,
          };
        }
      });
    });

    /** Remove old paths */
    for (const key in newPathToDraw) {
      if (!keys.includes(key)) {
        newPathToDraw[key].polilyne.setMap(null);
        delete newPathToDraw[key];
      }
    }

    setPathsToDraw(newPathToDraw);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapPaths]);

  /** Draw the Map or Loading */
  return !isLoaded ? (
    <CircularLoading />
  ) : (
    <>
      <GMap
        mapContainerStyle={{ width: '100%', height: '100%' }}
        center={ config.map.initCenter}
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
