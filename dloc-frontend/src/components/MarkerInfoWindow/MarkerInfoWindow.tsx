import { InfoWindowF } from "@react-google-maps/api";
import { ReactNode } from "react";

const MarkerInfoWindow = ({ position, children }: { position: google.maps.LatLng, children: ReactNode }) => {

  return (
    <InfoWindowF position={position}>
      {children}
    </InfoWindowF>
  );
}

export default MarkerInfoWindow;